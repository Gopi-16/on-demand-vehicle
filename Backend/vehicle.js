const request = require("request");
const cheerio = require("cheerio");

// Example vehicle number parts (you can pass via CLI args instead)
const regNo1 = process.argv[2]; // e.g. AP05
const regNo2 = process.argv[3]; // e.g. CD1234

if (!regNo1 || !regNo2) {
  console.error("❌ Please provide vehicle number parts: node app.js AP05 CD1234");
  process.exit(1);
}

const data = {
  'javax.faces.partial.ajax': 'true',
  'javax.faces.source': 'form_rcdl:j_idt32',
  'javax.faces.partial.execute': '@all',
  'javax.faces.partial.render': 'form_rcdl:pnl_show form_rcdl:pg_show form_rcdl:rcdl_pnl',
  'form_rcdl:j_idt32': 'form_rcdl:j_idt32',
  'form_rcdl': 'form_rcdl',
  'form_rcdl:tf_reg_no1': regNo1,
  'form_rcdl:tf_reg_no2': regNo2
};

// Step 1: Get session + token
request.post({ url: 'https://parivahan.gov.in/rcdlstatus/' }, (err, httpResponse, html) => {
    console.log(httpResponse);
  if (err) {
    console.error("❌ Request failed:", err);
    return;
  }

  const $ = cheerio.load(html);
  const token = $('input[name="javax.faces.ViewState"]').val();
  const cookies = httpResponse.headers['set-cookie'];

  if (!token || !cookies) {
    console.error("❌ Failed to fetch session token or cookies.");
    return;
  }

  data['javax.faces.ViewState'] = token;
  const headers = { 'Cookie': cookies };

  // Step 2: Post with vehicle number
  request.post({ url: 'https://parivahan.gov.in/rcdlstatus/', form: data, headers: headers }, (err2, httpResponse2, html2) => {
    if (err2) {
      console.error("❌ Error fetching vehicle details:", err2);
      return;
    }

    const vehicleDetailsPage = cheerio.load(html2);
    let response = {};

    vehicleDetailsPage("table").find("td").each(function () {
      if (vehicleDetailsPage(this).children().length) {
        if (vehicleDetailsPage(this).children().hasClass("font-bold")) {
          response[vehicleDetailsPage(this).children().text()] =
            vehicleDetailsPage(this).next().children().length
              ? (vehicleDetailsPage(this).next().children().hasClass("font-bold") ? "" : vehicleDetailsPage(this).next().children().text())
              : vehicleDetailsPage(this).next().text();
        }
      }
    });

    if (Object.keys(response).length > 0) {
      console.log("✅ Vehicle Details Found:");
      console.log(response);
    } else {
      console.error("❌ No vehicle details found. Possibly invalid number or blocked by server.");
    }
  });
});
