import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

interface LeveradeStandings {
  meta: {
    standingsrows: {
      id: number;
      name: string;
      position: number;
      standingsstats: {
        type: string;
        value: number;
      }[];
    }[];
  };
}

const getStat = (stats: { type: string; value: number }[], type: string) => {
  const matchingStat = stats.find((stat) => stat.type === type);
  if (!matchingStat) {
    return 0;
  }
  return matchingStat.value;
};

const handler: Handler = async (event, context) => {
  const requestedGroupId: string = event.queryStringParameters.groupId;

  if (!requestedGroupId) {
    return {
      statusCode: 400,
      body: "No group ID specified",
    };
  }

  const standingEndpoint = `https://api.leverade.com/groups/${requestedGroupId}/standings`;

  if (!standingEndpoint) {
    return {
      statusCode: 400,
      body: "Competition not supported or recognised",
    };
  }

  try {
    const response = await fetch(standingEndpoint, {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as LeveradeStandings;

    const standings = data.meta.standingsrows.map((team) => {
      return {
        id: team.id,
        position: team.position,
        name: team.name,
        points: getStat(team.standingsstats, "score"),
        played: getStat(team.standingsstats, "played_matches"),
        won: getStat(team.standingsstats, "won_matches"),
        draw: getStat(team.standingsstats, "drawn_matches"),
        lost: getStat(team.standingsstats, "lost_matches"),
        scored: getStat(team.standingsstats, "value"),
        received: getStat(team.standingsstats, "value_against"),
        difference: getStat(team.standingsstats, "value_difference"),
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(standings),
    };
  } catch (error) {
    return { statusCode: 422, body: String(error) };
  }
};

export { handler };
