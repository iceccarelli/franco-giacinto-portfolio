import { OBC_LIMITS } from "./obc";
import type { Guide } from "./guides";

/**
 * Additional long-form guides. Concat onto `guides` in data/guides.ts.
 * Slugs must stay unique against the existing nine.
 */
export const guideExpansions: Guide[] = [
  {
    slug: "nail-down-vs-glue-down-vs-floating-hardwood",
    title: "Nail-down vs glue-down vs floating hardwood",
    description:
      "Which hardwood fastening system belongs on a wood joist house, a condo slab, and a radiant floor in Ontario.",
    kicker: "Installation",
    read: "8 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "The system is the floor",
        paragraphs: [
          "Homeowners shop species. Failed floors are almost never a species mistake — they are a fastening mistake. Nail-down, glue-down and floating are three different assemblies with three different failure modes, and the right one is decided by what is under the floor, not by what you want the floor to look like.",
          "Specify the system from the subfloor up, then pick the oak. Doing it the other way round is how a solid 5-inch plank ends up glued to a slab that reads 88 percent relative humidity.",
        ],
      },
      {
        heading: "Nail-down: wood subfloor, solid or engineered",
        paragraphs: [
          "Cleats or staples through the tongue into a wood subfloor, 6 to 8 inches apart with two fasteners near each end of every board. It is the assembly most Toronto houses were built for, and it is the only one that suits 3/4-inch solid hardwood.",
          "It needs a wood subfloor of adequate thickness — 5/8-inch minimum over joists at 16 inches on centre, and 3/4-inch is better. It also needs the subfloor flat within about 3/16 of an inch over 10 feet. A 1920s house with a hog in the middle of the room is a flattening job before it is a flooring job, and that work is real money that a quote which omits it will find later.",
          "Failure mode: squeaks. Almost always underfastening, a subfloor that was never screwed down to the joists, or boards installed across a subfloor that was not flat.",
        ],
      },
      {
        heading: "Glue-down: concrete, radiant, and anywhere movement must be controlled",
        paragraphs: [
          "Full-spread adhesive under engineered board. It is the assembly for a condo slab, for anything over hydronic radiant, and for wide plank where seasonal movement has to be held rather than allowed.",
          "The adhesive is not a commodity. Moisture-cure urethanes tolerate slab moisture that a water-based adhesive will not, and most manufacturers void the wear-layer warranty if their own moisture limit is exceeded — which is why the slab gets tested before anything is ordered, not after the boards are on site.",
          "Failure mode: hollow spots and eventual delamination, from trowel notches that were wrong for the board, adhesive that flashed off before the board went down, or a slab that was wet.",
        ],
      },
      {
        heading: "Floating: fast, forgiving, and audibly a floating floor",
        paragraphs: [
          "Click-lock engineered board over an underlayment, fastened to nothing. It tolerates a less-than-perfect subfloor, it goes down quickly, and it can be lifted.",
          "It also sounds like what it is. A floating floor over a slab has a hollow report underfoot that no underlayment fully removes, and in a big open room it moves as one sheet — which is why expansion gaps at every vertical surface are not optional and why a floating floor under a heavy kitchen island is a call-back waiting to happen.",
          "Floating a floor over hydronic radiant to save money is the specific decision that voids most mill warranties. The heat has to conduct through an air gap it was never designed to cross.",
        ],
      },
      {
        heading: "How to read a quote",
        paragraphs: [
          "A quote that does not name the fastening system is not a quote for a floor, it is a price for boards. Ask which system, which adhesive or fastener, and what the subfloor preparation allowance is. Three numbers that look competitive can be three different assemblies.",
          "If a contractor proposes floating over radiant, or solid 3/4-inch over a slab, or nail-down over a subfloor nobody has measured for flatness, the conversation is over — not because it will fail tomorrow, but because it will fail in year three and the warranty will not be there.",
        ],
      },
    ],
  },
  {
    slug: "hardwood-subfloor-prep-ontario",
    title: "Hardwood subfloor prep in Ontario houses",
    description:
      "Moisture, flatness, fasteners, and the ugly work that decides whether a GTA hardwood install lasts.",
    kicker: "Installation",
    read: "7 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "The part of the job nobody photographs",
        paragraphs: [
          "Every hardwood failure a Toronto shop gets called to fix is either moisture or flatness. Neither is visible in the finished floor photograph, which is exactly why subfloor preparation is the line most often thinned out of a competing quote.",
          "It is also the line that cannot be added later. Once the floor is down, correcting the subfloor means taking the floor up.",
        ],
      },
      {
        heading: "Flatness: the number that governs",
        paragraphs: [
          "The working tolerance for most nail-down and glue-down hardwood is about 3/16 of an inch over a 10-foot span. Wide plank and glue-down assemblies are less forgiving than narrow strip, because a board that cannot flex has to bridge, and a bridged board telegraphs every void underneath it as a hollow spot or a squeak.",
          "You find it with a straightedge and a light, not by eye. In a 1920s Toronto semi the usual pattern is a crown over a bearing wall and a dish in the middle of the room. In a 1990s Vaughan build it is more often local — a proud seam where two sheets meet, or a run of joists that dried differently.",
          "High spots get sanded or planed. Low spots get filled with a cementitious patch that is rated for the assembly going over it. Neither is glamorous and both are cheaper than the alternative.",
        ],
      },
      {
        heading: "Moisture: measure, do not assume",
        paragraphs: [
          "Wood subfloors get a moisture meter reading, and the number that matters is not the flooring alone — it is the difference between the flooring and the subfloor. A gap wider than about 2 percent for narrow strip, or 1 percent for wide plank, means one of them will move relative to the other after installation.",
          "Concrete slabs need a real test, not a plastic sheet taped down overnight. In-situ relative humidity probes drilled into the slab (ASTM F2170) are the current standard because they read the moisture that will eventually reach the surface, not just what is at the top today. A slab that reads dry in August can read very differently in March.",
          "Below-grade and on-grade slabs also need a vapour retarder in the assembly. A basement floor in Etobicoke without one is a floor with a countdown on it.",
        ],
      },
      {
        heading: "Fastening the subfloor before fastening the floor",
        paragraphs: [
          "Squeaks that appear a year after a new hardwood floor are usually not the hardwood. They are the subfloor moving against a joist it was only ever nailed to. Screwing the subfloor down to the joists — properly, on a grid, before anything else happens — is an hour of work that removes the most common warranty call a flooring company gets.",
          "In older houses it is also worth checking for a second layer. Plenty of Toronto floors have had a plywood underlay added over the original planks at some point, and the two layers are not always fastened to each other.",
        ],
      },
      {
        heading: "What good preparation looks like on paper",
        paragraphs: [
          "A written allowance for flattening, a stated moisture testing method, and a note on what happens if the readings come back outside limits. That last clause is the honest one: it says the price may change and explains exactly what would change it.",
          "A quote with no subfloor line is not cheaper. It has simply moved the risk onto you.",
        ],
      },
    ],
  },
  {
    slug: "acclimation-hardwood-gta",
    title: "How long to acclimate hardwood in the GTA",
    description:
      "Why a five-day calendar guess fails in a January Toronto house, and how Green Hardwood actually stages material.",
    kicker: "Installation",
    read: "5 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "Acclimation is not a waiting room",
        paragraphs: [
          "Boards sitting in a sealed carton in a garage in February are not acclimating. They are cold. Material has to sit in the finished conditions of the room it will occupy — heat on, at the humidity the house will actually run at — with the cartons open or cross-stacked so air reaches every face.",
          "Five days is a folk number. It comes from a world of narrow strip red oak delivered from a local mill in the same climate. It is not a specification and it is not a defence when a floor cups.",
        ],
      },
      {
        heading: "What is actually being matched",
        paragraphs: [
          "The target is moisture content equilibrium, not elapsed time. Solid hardwood in most of southern Ontario settles somewhere around 6 to 9 percent moisture content in service. The board arriving from the mill may be at 7 percent or at 11, and the subfloor it is going onto has its own reading.",
          "The test is the difference. For narrow strip, a gap of more than about 2 percent between flooring and subfloor means movement after installation. For wide plank the tolerance tightens to roughly 1 percent, because a 7-inch board expresses the same percentage change across four times the width of a 1.75-inch strip.",
          "That is why acclimation ends with a meter reading rather than with a date on the calendar, and why a delivery note that says the material sat on site for five days is not evidence that it was ready.",
        ],
      },
      {
        heading: "The Ontario problem specifically",
        paragraphs: [
          "A GTA house swings harder than the continental average. Interior relative humidity in a Toronto house in January, with forced air running and no humidifier, routinely sits in the low twenties. The same house in August, unconditioned, can be over sixty. That is a wider annual range than most flooring is engineered to be indifferent to.",
          "It means a July install and a January install of the same floor are genuinely different jobs. Material delivered in July into an unconditioned house is at the wet end of its year and will shrink; the gaps show up in February. Material delivered in January into a dry house is at the dry end and will expand; the cupping shows up in July.",
          "The correct response is to install to the middle of the house's actual range, not to the condition on the day. That requires knowing the range, which requires asking whether there is a humidifier and whether it gets used.",
        ],
      },
      {
        heading: "What we do on site",
        paragraphs: [
          "Deliver into the finished space, not the garage and not the basement. Heat or air conditioning running and stabilised — a house still being drywalled is not at its service condition. Meter the flooring and the subfloor, write both numbers down, and install when they converge rather than when the week is up.",
          "If the readings will not converge because the house cannot hold a stable condition yet, the honest answer is to reschedule. A floor installed to a temporary condition is a floor installed wrong.",
        ],
      },
      {
        heading: "What it means for your schedule",
        paragraphs: [
          "Plan for material on site before the install window, in a room that is finished enough to hold temperature. If the trades are still working wet — drywall mud, paint, self-levelling compound — the wood should not be in the building at all. Wet trades are a humidity source and hardwood is a sponge with a finish on it.",
        ],
      },
    ],
  },
  {
    slug: "herringbone-hardwood-installation-toronto",
    title: "Herringbone hardwood installation in Toronto",
    description:
      "Layout, waste factor, and cost of herringbone and chevron hardwood in condos and houses across the GTA.",
    kicker: "Installation",
    read: "6 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "Herringbone is a labour decision, not a material one",
        paragraphs: [
          "The boards cost what boards cost. What changes is the layout, the waste and the time. Herringbone and chevron add roughly 40 to 55 percent to installation labour on a straight-lay equivalent, and the pattern generates more offcut than a straight field because every board meets a wall or a border at an angle.",
          "Budget waste accordingly. A straight lay might run 5 to 8 percent; a herringbone field on a room with several angles runs meaningfully higher.",
        ],
      },
      {
        heading: "Herringbone and chevron are not the same pattern",
        paragraphs: [
          "Herringbone is rectangular blocks laid at 90 degrees to each other, forming a broken zigzag — the end of one block meets the side of the next. Chevron is mitred: each board is cut at an angle so the ends meet point to point and the zigzag is continuous.",
          "Chevron costs more because every board is a compound cut and any error accumulates down the row. People routinely ask for herringbone and mean chevron, or the reverse. Establish which one is being priced.",
        ],
      },
      {
        heading: "The layout decides whether it looks right",
        paragraphs: [
          "A herringbone field is set out from a centreline, and the choice of that line is the single most consequential decision in the job. Square to the longest wall is the easy answer and frequently the wrong one — the correct reference is usually the sightline a person actually walks or looks along, which in a Toronto semi is the hall and in a condo is the window wall.",
          "Old houses are not square. A field set out square to one wall will run visibly out against the opposite one, and the pattern amplifies the error because the eye has a repeating geometry to measure it against. This is decided with chalk lines and a dry lay before any adhesive is opened, and it is worth the half day.",
        ],
      },
      {
        heading: "Assembly: over a slab, over joists, over radiant",
        paragraphs: [
          "In a downtown condo the assembly is engineered board glued down to a slab that has been moisture tested. Herringbone puts more end-grain joints per square metre than a straight lay, so adhesive coverage matters more, not less.",
          "Over radiant, everything in the radiant guide applies and the pattern does not change it: engineered, glued, temperature limited, commissioned. Over wood joists in a house, nail-down herringbone is possible but the layout tolerance is tighter than most crews are used to.",
        ],
      },
      {
        heading: "Borders and where the pattern stops",
        paragraphs: [
          "A herringbone field usually needs a border to terminate against, because the pattern ends in a ragged edge of angles. A single or double border in the same species reads as intentional; running the pattern into a wall and covering it with baseboard does not.",
          "Decide where the pattern stops at doorways before it starts. A field that runs through a doorway at the wrong angle is not fixable afterwards.",
        ],
      },
    ],
  },
  {
    slug: "radiant-heat-hardwood-ontario",
    title: "Hardwood over radiant heat in Ontario",
    description:
      "Engineered assemblies, adhesive, and operating temperatures that keep a radiant hardwood floor from tearing itself apart.",
    kicker: "Installation",
    read: "6 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "Radiant does not forbid hardwood. It specifies it.",
        paragraphs: [
          "Hydronic radiant under hardwood is a normal, well-understood assembly. It is also the one where the wrong specification produces the most expensive failure, because the heat source is under the floor and runs for months.",
          "The rule of thumb: engineered board, glued down, with a surface temperature limit and a commissioning schedule. Almost every radiant hardwood failure is a departure from one of those three.",
        ],
      },
      {
        heading: "Why engineered, and why not solid",
        paragraphs: [
          "Radiant drives a moisture gradient through the board — dry at the bottom where the heat is, wetter at the top. Solid hardwood responds to that gradient by cupping or, over time, by checking along the grain.",
          "An engineered board is a plywood or HDF core with a hardwood wear layer, and the cross-laminated core is doing exactly the job the gradient demands: resisting dimensional change across the width. Quartersawn material is more stable again than plainsawn, which is why a quartersawn wear layer is worth asking about on a wide plank over radiant.",
          "Narrower boards also move less in absolute terms. A 5-inch engineered plank over radiant is a materially safer specification than a 9-inch one, and the difference is visible in most mills' own warranty language.",
        ],
      },
      {
        heading: "The temperature limit is the whole ballgame",
        paragraphs: [
          "Most manufacturers cap surface temperature at about 27\u00b0C — roughly 80\u00b0F — measured at the floor, not at the thermostat. Above that the wood dries faster than it can equalise and the gradient wins.",
          "This is a system design constraint, not a homeowner setting. A radiant loop designed to heat a poorly insulated room through a floor will want to run hotter than the floor allows. That is a problem to solve at design, with loop spacing and water temperature, not by asking the client to keep the thermostat down.",
        ],
      },
      {
        heading: "Commissioning: the step that gets skipped",
        paragraphs: [
          "A new slab with radiant in it has to be run before the floor goes on. The usual sequence is to bring the system up gradually over several days, hold it at operating temperature for a period, then bring it back down and let the slab reach the installation condition — and only then test slab moisture with in-situ probes.",
          "Skipping commissioning means installing over a slab that has never been dried by its own heating system. The floor then does the drying, from above, in year one.",
          "Ask any contractor quoting hardwood over radiant what their commissioning sequence is. If there is not one, they have not done this before.",
        ],
      },
      {
        heading: "Floating over radiant",
        paragraphs: [
          "Floating an engineered floor over radiant is the specific decision that voids most mill warranties, because the assembly puts an air gap and an underlayment between the heat and the wood. The heat has to conduct across something designed to insulate.",
          "Glue-down transfers heat directly and holds the board against the gradient. It costs more and it is the right answer.",
        ],
      },
    ],
  },
  {
    slug: "hardwood-stair-retread-cost-gta",
    title: "Hardwood stair retread cost in the GTA, 2026",
    description:
      "What it costs to convert carpet stairs to oak or walnut treads in Vaughan, Markham, Milton, and Toronto, and what blows the number up.",
    kicker: "Stairs",
    read: "7 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "What a retread actually is",
        paragraphs: [
          "Stripping the carpet off an existing flight and capping the treads and risers with hardwood, rather than rebuilding the stair. It is the most common stair job in the GTA because most builder houses were finished with carpet on the stairs and hardwood everywhere else.",
          "It is also the job most often underquoted, because from the top of the flight it looks like six hours of work.",
        ],
      },
      {
        heading: "What moves the number",
        paragraphs: [
          "Step count is the obvious one and the least interesting. The variables that actually move a retread quote are whether the stair is open on one side or both, whether the treads return at the ends, whether the flight is straight or has winders, and what the railing is doing.",
          "An open side means finished, returned tread ends and a guard — a different job from a closed flight boxed between two walls. Winders mean every tread is a different shape and has to be templated. A curved flight is fabrication, not installation.",
          "The railing is often the surprise. A flight that gets new treads frequently needs the existing rail brought up to current requirements at the same time, because once the stair is altered the old grandfather argument gets thin.",
        ],
      },
      {
        heading: "The published range, and why yours may sit outside it",
        paragraphs: [
          "The per-step range published on the stairs service page covers a conventional straight flight with a reasonable rail. It does not cover winders, curves, painted-to-wood conversions where the existing stringers turn out to be rough, or flights where the rise and run measure out of tolerance and need new stringers.",
          "Use the estimator on this site for a banded number against your own city, then treat a site measure as the thing that produces a real one. Anyone giving a firm stair price over the phone has not measured the first and last riser, which are the two that decide whether the job is a retread at all.",
        ],
      },
      {
        heading: "The trap: cheap caps",
        paragraphs: [
          "Thin retread caps exist and they are cheaper. They also project further than they should to cover the old tread edge, which is the fastest route to a nosing that exceeds the limit, and they can sound hollow underfoot because they bridge rather than bear.",
          "A retread done properly removes the old tread nosing, beds the new tread on a solid surface, and returns the ends. That is the version that reads as millwork and passes.",
        ],
      },
      {
        heading: "Sequencing with the floors",
        paragraphs: [
          "If the floors are being done as well, do them together. The stair's first and last risers depend on the finished floor heights at both ends, and the finish matches only if it is applied in one visit. Doing the floor in spring and the stair in autumn guarantees a visible difference.",
        ],
      },
    ],
  },
  {
    slug: "open-riser-floating-hardwood-stairs",
    title: "Open-riser and floating hardwood stairs",
    description:
      "When an open-riser oak stair is legal in Ontario, what it costs, and when Green Hardwood will refuse the drawing.",
    kicker: "Stairs",
    read: "6 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "What people mean by a floating stair",
        paragraphs: [
          "Two different things, usually. An open-riser stair has treads with nothing between them. A cantilevered or 'floating' stair has treads that appear to come out of the wall with no visible stringer. They are often specified together and they are structurally very different problems.",
          "Both are buildable in hardwood. Both cost considerably more than a box stair, and both are decided at framing, not at finishing.",
        ],
      },
      {
        heading: "The guard rule is what constrains the design",
        paragraphs: [
          `Ontario requires guards at the side of a dwelling stair to be at least ${OBC_LIMITS.minGuardMm} mm high, measured from the tread nosing line, and the openings in a guard must not permit the passage of a sphere of a defined diameter — the rule exists so a small child cannot fall through.`,
          "On an open-riser stair the space between treads comes under scrutiny for the same reason. This is the constraint that most often forces a redesign late, because the architectural drawing showed a gap that the building department will not accept.",
          "Confirm the specific requirement with your municipality before anything is fabricated. The limits differ by occupancy and the interpretation of guard openings on open risers is the part worth getting in writing.",
        ],
      },
      {
        heading: "Structure comes first",
        paragraphs: [
          "A cantilevered tread is a lever with a person standing on the end of it. The load goes back into a steel stringer, a reinforced wall, or a hidden bracket bolted to structure — and that structure has to exist before the drywall does.",
          "Retrofitting a cantilevered stair into a finished house means opening the wall. That is not a stair job with a wall repair attached; it is a structural job with a stair on the end of it, and it should be priced and sequenced that way.",
        ],
      },
      {
        heading: "Wood selection changes on an open riser",
        paragraphs: [
          "Both faces of every tread are visible, so the material has to be presentable on all sides and thick enough to look substantial — typically much thicker than a capped tread on a box stair. That means solid stock, well dried, with the grain read and matched across the flight.",
          "Movement matters more here too. A tread that is visible from below shows a cup or a twist that a closed stair would hide behind a riser.",
        ],
      },
      {
        heading: "The honest cost conversation",
        paragraphs: [
          "Open-riser and cantilevered stairs sit well above the published per-step range for a conventional hardwood stair, because the labour is fabrication rather than installation and because the structure usually needs work. Anyone quoting one at box-stair prices has not understood the drawing.",
          "The right sequence is a drawing, a structural review, a building-department conversation, and then a price.",
        ],
      },
    ],
  },
  {
    slug: "matching-hardwood-stairs-to-existing-floor",
    title: "Matching hardwood stairs to an existing floor",
    description:
      "How to stain new oak or walnut treads so they belong to a 10-year-old GTA hardwood floor instead of fighting it.",
    kicker: "Stairs",
    read: "5 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "Why the stair almost never matches",
        paragraphs: [
          "On most flooring jobs the floor and the stair are two different trades. The flooring company lays the field; the stair is subcontracted or left to a carpenter. Two suppliers, two batches of wood, two finishing schedules — and the stair lands a shade off.",
          "It is the most visible defect in the house, because a stair sits at eye level in the middle of the sightline and the floor runs away from you at an angle. A mismatch you would never notice in two rooms is obvious on one flight.",
        ],
      },
      {
        heading: "Species and cut, not just colour",
        paragraphs: [
          "Red oak and white oak take stain differently and will not converge no matter how the colour is mixed. Red oak is pinker and more open-grained; white oak is browner and tighter. Matching an existing red oak floor means sourcing red oak for the stair, not staining white oak darker.",
          "Cut matters as much. Quartersawn shows ray fleck and takes stain more evenly; plainsawn shows cathedral figure and blotches more. A quartersawn tread beside a plainsawn floor will read as a different wood even in the same species and the same stain.",
        ],
      },
      {
        heading: "Sheen is the giveaway",
        paragraphs: [
          "Two surfaces can be the same colour and still look wrong if one is satin and the other matte. Sheen is also where the site-finished versus prefinished decision shows: a prefinished floor has a factory UV-cured finish that a site-applied stair coat will not exactly match.",
          "The reliable answer is to finish the floor and the stair at the same time, with the same product, from the same batch. That is only possible if one shop is doing both — which is the whole argument for not subcontracting the stair.",
        ],
      },
      {
        heading: "Matching an existing floor you are not replacing",
        paragraphs: [
          "Harder, and honest expectations matter. An existing floor has aged: oak ambers with UV exposure over years, and new material of the same species and stain will start lighter and catch up over a period rather than matching on day one.",
          "The method is to make sample boards on the actual species, put them on the actual floor, and look at them in that house's light at the time of day the room is used. A sample viewed in a showroom under fluorescent light tells you very little about a north-facing Toronto hallway in November.",
          "Where the existing floor will be refinished as part of the work, the problem mostly disappears — everything gets sanded and coated together and the whole run reads as one piece.",
        ],
      },
      {
        heading: "What to ask for",
        paragraphs: [
          "Ask whether the stair and the floor come from the same shop, whether the finish is applied to both in the same visit, and to see sample boards in your own house before anything is cut. If the answer to the first question is no, the other two do not have a good answer.",
        ],
      },
    ],
  },
  {
    slug: "hardwood-stair-nosing-and-transitions",
    title: "Hardwood stair nosings and floor transitions",
    description:
      "Why the nosing, reducer, and landing detail make or break a hardwood stair and a hardwood install.",
    kicker: "Stairs",
    read: "5 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "The detail that fails inspection",
        paragraphs: [
          "A carpeted flight converted to hardwood is mostly a nosing problem. Carpet hid the geometry; hardwood shows it, and the inspector measures it.",
          `Ontario limits nosing projection to ${OBC_LIMITS.maxNosingMm} mm. It is the single most common reason a retread flight is failed, because a retread cap sits on top of the existing tread and the easy way to make the cap look right is to let it hang further than it should.`,
        ],
      },
      {
        heading: "Rise, run and tread depth are one calculation",
        paragraphs: [
          `Rise must not exceed ${OBC_LIMITS.maxRiseMm} mm on a stair serving a dwelling unit. Run must be at least ${OBC_LIMITS.minRunMm} mm. Tread depth — which is run plus the nosing projection, not run alone — must be at least ${OBC_LIMITS.minTreadMm} mm.`,
          "Those three interact, and a retread changes all of them at once. Adding a 20 mm cap to every tread does not change the rise between treads in the middle of the flight — but it does change the first rise from the floor below and the last rise to the floor above, and those two are where a flight most often goes out of tolerance.",
          "The flooring going in at the top and bottom changes them again. A 3/4-inch solid floor at the top landing and a tile floor at the bottom are two different first and last risers.",
        ],
      },
      {
        heading: "Consistency matters as much as the limits",
        paragraphs: [
          "A code-compliant flight where one riser is 12 mm taller than its neighbours is still a flight people trip on. The variation between the tallest and shortest riser in a run is a real limit, not a nicety, and it is the thing a retread most easily gets wrong when the original stringers were cut by eye in 1954.",
          "Measuring every riser before quoting is not thoroughness for its own sake. It is how you find out whether this flight can be retreaded at all or whether it needs new stringers.",
        ],
      },
      {
        heading: "Transitions at the top and bottom",
        paragraphs: [
          "Where the stair meets the floor is a joint between two assemblies that move differently. A landing tread with a returned end reads as millwork; a butt joint and a strip of quarter round reads as a repair.",
          "The nosing profile should match down the whole flight and continue onto the landing, so the eye follows one line. Mixing a bullnose on the treads with a square edge on the landing is the detail that makes a good stair look subcontracted — which, on most flooring jobs, it was.",
        ],
      },
      {
        heading: "Before you sign",
        paragraphs: [
          "Ask whether the quote includes new stringers or assumes the existing ones are square, what the first and last riser will measure once the new floors are in, and who is responsible if the flight does not pass. Those three questions separate a stair builder from a flooring company that also does stairs.",
          "Use the stair studio on this site to check a flight against the Ontario limits before anyone quotes it — it will not certify your stair, but it will tell you which dimension is the problem.",
        ],
      },
    ],
  },
  {
    slug: "builder-grade-stairs-upgrade-vaughan-markham",
    title: "Upgrading builder-grade stairs in Vaughan and Markham",
    description:
      "Carpet-to-oak conversions in GTA new builds: structure checks, returned treads, and a rail that will pass.",
    kicker: "Stairs",
    read: "6 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "The house is nine years old and the stair is the oldest thing in it",
        paragraphs: [
          "A recurring GTA pattern: a 2010s build in Vaughan, Markham, Richmond Hill or Brampton, hardwood on the main floor from day one, carpet on the stairs, and a builder-grade railing with thin round spindles. The kitchen has been redone, the floors are fine, and the stair is what the house looks like it was built as.",
          "It is the highest-return interior change available in that house, because the flight sits in the sightline from the front door.",
        ],
      },
      {
        heading: "What builder-grade actually means here",
        paragraphs: [
          "Usually: pine or poplar stringers and risers finished to be covered, a plywood or MDF tread never intended to be seen, carpet over the lot, and a rail assembly chosen on price. None of that is defective. It was specified to be finished later, and later has arrived.",
          "The good news is that a flight built to be carpeted is usually square and consistent, because it was factory-cut. Retreading a 2015 Vaughan stair is a far more predictable job than retreading a 1926 Toronto one.",
        ],
      },
      {
        heading: "What the upgrade involves",
        paragraphs: [
          "Carpet and underlay off, staples out, the existing tread nosing removed so the new tread beds flat, solid hardwood treads with returned ends on any open side, risers painted or clad, and a rail assembly that meets current requirements.",
          "The rail is the part homeowners underestimate. Swapping thin round spindles for square iron balusters changes the character of the whole hall more than the treads do, and once the stair is altered the rail generally has to meet today's rules rather than the ones in force when the house was built.",
        ],
      },
      {
        heading: "Matching the floor you already have",
        paragraphs: [
          "The existing main-floor hardwood is usually prefinished. Matching a site-finished stair to a prefinished floor exactly is difficult, and the honest options are to accept a close match on a deliberately contrasting stain, to refinish the main floor at the same time so everything is coated together, or to source the same prefinished product for the treads where the manufacturer still makes it.",
          "Say which one you are buying before the work starts. The failure here is not a bad match; it is an unstated expectation.",
        ],
      },
      {
        heading: "What it costs and how to price it",
        paragraphs: [
          "Use the estimator with your own city and step count for a 2026 band. Vaughan, Markham and Richmond Hill all carry their own labour and travel multiplier, so the number is not a Toronto number with a discount applied.",
          "Expect the rail to be a meaningful share of the total, and expect a site measure before anything is firm. The first and last risers change when the treads change, and those two dimensions decide the job.",
        ],
      },
    ],
  },
  {
    slug: "hardwood-flooring-trends-gta-2026",
    title: "Hardwood flooring trends in the GTA, 2026",
    description:
      "What GTA homeowners and designers are actually specifying in 2026 — wide-plank white oak, warm tones, matte finishes, pattern floors — and which trends age badly.",
    kicker: "Specification",
    read: "7 min",
    updated: "September 2026",
    updatedOn: "2026-09-02",
    sections: [
      {
        heading: "What is actually selling in the GTA right now",
        paragraphs: [
          "Wide plank white oak, 5 to 7 inches, in a low-sheen matte, is the centre of the market and has been for several years. It is not a fashion at this point; it is the default, and specifying it is a low-risk decision that will not look dated quickly.",
          "The movement at the edges is toward less colour, not more. Heavy grey-wash stains and very dark espresso floors have both aged badly enough to be visible in resale listings, and the current direction is natural or lightly toned oak where the grain carries the interest instead of the pigment.",
        ],
      },
      {
        heading: "Pattern is where the money is going",
        paragraphs: [
          "Herringbone has moved from a period detail to something a builder will offer in a spec home. In practice that means the request is common enough that a homeowner should understand the labour premium before asking — see the herringbone guide on this site for the numbers.",
          "Feature borders and small inlays are appearing again in entries and dining rooms, at a scale that is affordable because it is one room rather than a whole floor.",
        ],
      },
      {
        heading: "Finish: two-component waterborne has won",
        paragraphs: [
          "Site-finished floors in the GTA are largely finished in two-component waterborne systems now. They are durable, they cure fast enough to get a family back into the house quickly, and they do not amber the way oil-modified polyurethane does.",
          "Hardwax oil remains a real choice for people who want a very matte, repairable, in-the-wood look and who understand that it is a maintenance relationship rather than a one-time coating. It is genuinely repairable in place, which no film finish is.",
        ],
      },
      {
        heading: "Stairs as the visible upgrade",
        paragraphs: [
          "The clearest change in what GTA homeowners are buying is the stair. Carpeted flights in otherwise-finished houses are being converted at a rate that suggests people have worked out it is the most visible interior change per dollar available.",
          "Iron balusters against oak, square profiles rather than turned, and open-side returned treads are the common specification. The rail is doing more of the design work than the treads.",
        ],
      },
      {
        heading: "What to be sceptical of",
        paragraphs: [
          "Very wide plank — 9 inches and up — in a house with a big seasonal humidity swing and no humidifier. It is beautiful and it moves. If you want it, the assembly has to be engineered and glued, and that should be stated up front rather than discovered.",
          "Anything sold as maintenance-free. Every wood floor is a maintenance relationship; the question is only what kind. A finish that never needs attention is a finish that cannot be repaired without resanding the room.",
        ],
      },
    ],
  },
];
