const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const sql = require("mssql");
const GeoJSON = require("geojson");

const app = express();
app.use(cors());

const config = {
  user: "sde",
  password: "Sdgis12345mn",
  server: "103.31.82.102",
  database: "MPPL_Infra",
  options: {
    trustedConnection: true,
  },
  port: 1433,
};

// Fetch joints data
async function getJointsData(req, res) {
  try {
    let conn = await sql.connect(config);
    let result = await conn
      .request()
      .query(
        "SELECT * FROM [MPPL_Infra].[sde].[Regional_Joints] WHERE section = 'LongHaul'"
      );

    let data = result.recordset;
    res.json(GeoJSON.parse(data, { Point: ["Latitude", "Longitude"] }));
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    sql.close();
  }
}

app.get("/joints", getJointsData);

module.exports.handler = serverless(app);
