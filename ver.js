const fs = require("fs");
const moment = require("moment");

var data = fs.readFileSync(".ver", "utf-8");

var build_date = moment().format("YYYY-MM-DD HH:mm:ss");
var v = parseInt(data);
v++;
console.log("read .ver=", v);
console.log("build_date=", build_date);

fs.writeFileSync(".ver", `${v}`);

// fs.writeFileSync(
//   ".\\src\\ver.ts",
//   `
// export const VERSION=${v};
// export const BUILD_DATE='${build_date}';
// `.trim()
// );

/*
index.html 의 
<!-- template begin -->
와
<!-- template end -->
를 찾아 사이에 내용을 변경한다.
*/

const COND_BEGIN = "<!-- template begin -->";
const COND_END = "<!-- template end -->";

var output = "";
var text = fs.readFileSync("index.html", "utf-8");
var lines = text.split("\n");
for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  output += line + "\n";

  if (line.indexOf(COND_BEGIN) < 0) continue;
  console.log("found begin", i);

  line = `
    <div>v${v} - ${build_date}</div>
  `;
  line = "    " + line.trim();
  console.log("line", line);
  output += line + "\n";

  for (i = i + 1; i < lines.length; i++) {
    var line = lines[i];
    if (line.indexOf(COND_END) < 0) continue;
    console.log("found begin", i);

    // 이후 내용은 다 붙여넣는다.
    for (; i < lines.length; i++) {
      var line = lines[i];
      output += line + "\n";
    }
    break;
  }
  break;
}

fs.writeFileSync("index.html", output, "utf-8");
