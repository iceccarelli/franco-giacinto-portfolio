# Query inventory — map every search to one URL

Priority: 1 = own this year, 2 = support, 3 = only if a page already exists.

## Stairs (wedge)

| Query                                 | Priority | URL                                                  |
| ------------------------------------- | -------- | ---------------------------------------------------- |
| hardwood stairs Toronto               | 1        | /services/hardwood-stairs                            |
| hardwood stairs GTA                   | 1        | /services/hardwood-stairs                            |
| oak stair treads Toronto              | 1        | /services/hardwood-stairs                            |
| carpet to hardwood stairs             | 1        | /guides/carpet-to-hardwood-stairs-gta                |
| hardwood stair retread cost           | 1        | /guides/hardwood-stair-retread-cost-gta              |
| hardwood stairs Vaughan               | 1        | /services/hardwood-stairs/vaughan                    |
| hardwood stairs Markham               | 1        | /services/hardwood-stairs/markham                    |
| hardwood stairs Mississauga           | 1        | /services/hardwood-stairs/mississauga                |
| hardwood stairs Oakville              | 1        | /services/hardwood-stairs/oakville                   |
| hardwood stairs Milton                | 2        | /services/hardwood-stairs/milton                     |
| open riser stairs Ontario code        | 1        | /guides/open-riser-floating-hardwood-stairs          |
| Ontario building code stairs hardwood | 1        | /guides/ontario-stair-code-hardwood                  |
| match stair stain to floor            | 2        | /guides/matching-hardwood-stairs-to-existing-floor   |
| builder grade stairs upgrade          | 1        | /guides/builder-grade-stairs-upgrade-vaughan-markham |
| how much do hardwood stairs cost      | 1        | /answers/how-much-hardwood-stairs-cost-gta           |
| best hardwood stairs company Toronto  | 1        | /answers/best-hardwood-stairs-company-toronto        |
| will hardwood stairs pass inspection  | 1        | /answers/will-hardwood-stairs-pass-inspection        |

## Installation (wedge)

| Query                                   | Priority | URL                                                 |
| --------------------------------------- | -------- | --------------------------------------------------- |
| hardwood floor installation Toronto     | 1        | /services/hardwood-installation                     |
| hardwood installation GTA               | 1        | /services/hardwood-installation                     |
| solid hardwood install Toronto          | 1        | /services/hardwood-installation                     |
| engineered hardwood condo Toronto       | 1        | /guides/solid-vs-engineered-ontario                 |
| nail down vs glue down hardwood         | 1        | /guides/nail-down-vs-glue-down-vs-floating-hardwood |
| hardwood over radiant heat Ontario      | 1        | /guides/radiant-heat-hardwood-ontario               |
| herringbone hardwood Toronto            | 1        | /guides/herringbone-hardwood-installation-toronto   |
| hardwood subfloor prep                  | 2        | /guides/hardwood-subfloor-prep-ontario              |
| how long to acclimate hardwood          | 2        | /guides/acclimation-hardwood-gta                    |
| hardwood installation cost Toronto 2026 | 1        | /guides/hardwood-flooring-cost-gta-2026             |
| hardwood installation Mississauga       | 1        | /services/hardwood-installation/mississauga         |
| hardwood installation Vaughan           | 1        | /services/hardwood-installation/vaughan             |
| best hardwood installer Toronto         | 1        | /answers/best-hardwood-installation-toronto         |

## Railings + supporting

| Query                     | Priority | URL                                    |
| ------------------------- | -------- | -------------------------------------- |
| hardwood railings Toronto | 1        | /services/hardwood-railings            |
| oak handrail installation | 2        | /methods/hardwood-railing-through-bolt |
| dustless sanding Toronto  | 1        | /guides/dust-free-sanding-toronto      |
| hardwood vs vinyl GTA     | 2        | /compare                               |

If a query is not in this table, do not create a page for it this quarter.

## Methods (added by the authority pack)

| Query                                   | Priority | URL                                       |
| --------------------------------------- | -------- | ----------------------------------------- |
| how is hardwood installed               | 1        | /methods/nail-down-solid-hardwood         |
| glue down engineered hardwood concrete  | 1        | /methods/glue-down-engineered-hardwood    |
| carpet to hardwood stair retread method | 1        | /methods/carpet-to-hardwood-stair-retread |
| open riser stair construction           | 1        | /methods/open-riser-steel-and-oak         |
| subfloor moisture testing hardwood      | 2        | /methods/moisture-mapping-subfloor        |
| how to attach a stair railing           | 2        | /methods (railings cluster)               |

## Definitions (single page, anchored)

Every term resolves at `/glossary#slug`. Do **not** split these into separate
pages — twenty-two one-paragraph URLs is the definition of thin content.

| Query                         | URL                         |
| ----------------------------- | --------------------------- |
| what is a stair nosing        | /glossary#nosing            |
| what is acclimation hardwood  | /glossary#acclimation       |
| what is a stringer stairs     | /glossary#stringer          |
| janka hardness meaning        | /glossary#janka             |
| screen and recoat vs refinish | /glossary#screen-and-recoat |

## Coverage after this pack

| Surface               | Pages                     |
| --------------------- | ------------------------- |
| Services              | 8                         |
| Service x city        | 224                       |
| Cities                | 32 (20 core, 12 travel)   |
| Guides                | 19                        |
| Methods               | 8                         |
| Answers               | 28                        |
| Glossary              | 1 page, 22 anchored terms |
| Tools & company       | ~19                       |
| **Total prerendered** | **341**                   |

## Rule for adding more

A new URL earns its place if it answers a query that no existing URL answers
better. If the honest answer is "this is a paragraph on an existing page", it is
a paragraph on an existing page. `npm run audit:site` fails on duplicate titles
precisely to stop this from drifting.

## Diagnostics — the highest-intent queries on the site

Somebody typing "why is my hardwood floor cupping" at eleven at night has a
problem in front of them and is not shopping. These are the queries where a
straight answer earns the call.

| Query                              | URL                                     |
| ---------------------------------- | --------------------------------------- |
| why is my hardwood floor cupping   | /problems/hardwood-floor-cupping        |
| hardwood floor crowning            | /problems/hardwood-floor-crowning       |
| gaps between floorboards in winter | /problems/gaps-in-hardwood-floor-winter |
| hardwood floor buckling / lifting  | /problems/hardwood-floor-buckling       |
| squeaking hardwood floor           | /problems/squeaking-hardwood-floor      |
| squeaking stairs                   | /problems/squeaking-stairs              |
| loose / wobbly stair railing       | /problems/loose-stair-railing           |
| stair nosing loose or cracked      | /problems/loose-stair-nosing            |
| worn stair treads                  | /problems/worn-stair-treads             |
| what is under carpet on stairs     | /problems/stairs-after-carpet-removal   |
| floor finish peeling               | /problems/peeling-hardwood-finish       |
| white / cloudy marks on hardwood   | /problems/cloudy-white-hardwood-finish  |
| white scratches on hardwood        | /problems/scratches-showing-white       |
| dull worn traffic paths            | /problems/dull-worn-traffic-paths       |
| dog urine stains on hardwood       | /problems/pet-urine-stains-hardwood     |
| hollow or bouncy floor             | /problems/hollow-spots-hardwood-floor   |

Each page follows the same shape: what it looks like, ranked causes each with
the observation that distinguishes it, what it means, whether it can be fixed,
what the homeowner can safely do, and when to call.

**The rule for this section: name the unfixable cases.** Pet urine that reached
the subfloor, a floor crowned by being sanded wet, a stair built from
construction lumber — saying so plainly is what makes the repairable diagnoses
believable.

## Service tiers

`data/areas.ts` marks each city `core` or `extended`.

- **core** (20) — free on-site measure for any qualified job.
- **extended** (12) — we travel, but the job has to justify the drive: stair
  packages, whole-home installs, refinishing. Not a single-room repair.

The distinction is published on the area page, the matrix page, and the areas
index, and it is priced into `cityMult`. A test asserts extended-tier towns
average above the core multiplier — a crew losing ninety minutes a day to travel
costs more per square foot, and quoting otherwise means quoting a number we
cannot hold.

This is a commercial statement, not a formatting choice. Ranking for
"hardwood stairs Barrie" and then declining the call is worse than not ranking.
