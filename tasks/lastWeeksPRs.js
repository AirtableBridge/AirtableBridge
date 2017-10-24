const { authenticate, query } = require("../airtable");
const airtable = authenticate();

(async () => {
  const records = await query(airtable, {
    table: "Pulls",
    view: "Pulls",
    formula: ""
  });

  console.log(
    records.map(r => `${r.get("ID")} - ${r.get("Merged")} - ${r.get("Title")}`)
  );
})();

[
  "4442 - 2017-10-20 - bump yarn",
  "4441 - 2017-10-21 - Blackboxed sources distinguished by icon in source tree ",
  "4447 - 2017-10-20 - The second 10/13 release",
  '4416 - 2017-10-18 - Revert "Use a monospace font for editor line numbers"',
  "4427 - 2017-10-23 - Fixes 3846 Source Tabs and Gutter Column Don't Line Up",
  "4404 - 2017-10-17 - Cleanup babel",
  "4473 - 2017-10-23 - fix #4471 - expand the right sidebar on pausing at breakpoint",
  "4467 - 2017-10-23 - Highlight errors in editor",
  "4468 - 2017-10-23 - Differentiate between computed and uncomputed member expressions",
  "4448 - 2017-10-20 - Undo string change to editor.addConditionalBreakpoint",
  "4414 - 2017-10-17 - Update mochii to the latest version 🚀",
  "4477 - 2017-10-23 - Converted Source Tree SVG's (including Blackbox) to images using CSS styles (#4350)",
  "4476 - 2017-10-23 - Add Next.js to framework frames",
  "4474 - 2017-10-23 - Fix footer background length in dark theme",
  "4458 - 2017-10-21 - support framework frames for Aframe #2980",
  "4340 - 2017-10-10 - Fixed issue #4291",
  "4323 - 2017-10-11 - add a GotoLineModal",
  "4337 - 2017-10-10 - Align empty message in Source Tab",
  "4327 - 2017-10-09 - Use Flow for Proptype checking in Source Tree",
  "4332 - 2017-10-11 - Upgrade Launchpad",
  "4347 - 2017-10-11 - fix browser toolbox issues",
  "4335 - 2017-10-10 - Update travis MC commit",
  '4330 - 2017-10-09 - - unifies right click "Copy source URI" for tree view & tab view (#4325)',
  "4339 - 2017-10-10 - Remove last vestige of devtools.debugger.client-source-maps-enabled"
];
