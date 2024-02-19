const router = require("express").Router();
const fetch = require("axios");
const OpenAI = require("openai");

router.get("/search/:string", async (req, res) => {
  // Route to get movies by title search
  try {
    const { from, to, certificates, groups, runtime, genres } =
      req.query || false;

    const today = new Date();
    const thisYear = today.getFullYear();
    let queryParams = [];

    // build the date range parameter
    let dateRange = "release_date=";
    dateRange += from ? `${from},` : ",";
    dateRange += !to || to > thisYear ? `${thisYear}` : `${to}`;
    queryParams.push(dateRange);

    // build the movie rating and Best Picture winner parameters
    if (certificates) queryParams.push(`certificates=${certificates}`);
    if (groups) queryParams.push(`groups=${groups}`);
    if (runtime) queryParams.push(`runtime=${runtime}`);
    if (genres) queryParams.push(`genres=${genres.toLowerCase()}`);

    let searchUrl = `https://tv-api.com/API/AdvancedSearch/${
      process.env.IMDB_API_KEY
    }?${
      req.params.string === "noTitle" ? "" : `title=${req.params.string}&`
    }title_type=feature&num_votes=1000,has=plot&sort=boxoffice_gross_us,desc`;
    searchUrl += queryParams.length > 0 ? `&${queryParams.join("&")}` : "";

    const options = {
      method: "GET",
      url: searchUrl,
    };

    const movieData = await fetch.request(options);
    const returnMovies = movieData.data.results;

    // clean results for nc17, tv-ma, x and upcoming
    let ratedMovies = returnMovies.filter(
      (val) =>
        val.contentRating !== "NC-17" &&
        val.contentRating !== "TV-MA" &&
        val.contentRating !== "X"
    );

    res.status(200).json(ratedMovies);
  } catch (err) {
    console.log(err);
    if (err.code === "ETIMEDOUT")
      res.status(500).json({
        message: "Our data source is not responding. Please try again later.",
      });
    else res.status(500).json(err);
  }
});

router.post("/ai-search", async (req, res) => {
  // Route to get movies by OpenAI search

  const userRequest = req.body.userRequest;

  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  try {
    // ask ChatGPT for results
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: `Show me the best feature films that ${userRequest}`,
        },
        {
          role: "system",
          content:
            "Include title, year, imDb id, imDb plot synopsis, MPAA rating and worldwide gross",
        },
        {
          role: "system",
          content: "Return up to ten movies that match the request",
        },
        {
          role: "system",
          content: "Format as JSON",
        },
      ],
    });
    res.status(200).json(chatCompletion.choices[0].message.content);
  } catch (err) {
    console.log(err);
    if (err.code === "ETIMEDOUT")
      res.status(500).json({
        message: "Our data source is not responding. Please try again later.",
      });
    else res.status(500).json(err);
  }
});

module.exports = router;
