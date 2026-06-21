/* ============================================================
   LEAD ROLE — DATA LAYER
   All training, aesthetic-science, nutrition and knowledge content.
   Original material based on standard, widely-documented
   strength-training and exercise-science principles.
   ============================================================ */
window.DATA = (function () {

/* ---------- generic figure glyphs (decorative line icons) ---------- */
const FIG = {
  press:'<path d="M12 3a2 2 0 100 4 2 2 0 000-4z"/><path d="M12 7v7m0 0l-3 7m3-7l3 7"/><path d="M6 6l6 3 6-3"/><path d="M3 6h3M18 6h3"/>',
  pull:'<path d="M12 3a2 2 0 100 4 2 2 0 000-4z"/><path d="M5 5h14"/><path d="M9 5l3 6 3-6M12 11v4m0 0l-2 6m2-6l2 6"/>',
  legs:'<path d="M12 3a2 2 0 100 4 2 2 0 000-4z"/><path d="M12 7v6l-4 8M12 13l4 8M8 10h8"/>',
  core:'<path d="M12 3a2 2 0 100 4 2 2 0 000-4z"/><path d="M12 7v5M8 9c1.5 1.5 6.5 1.5 8 0M9 12l-2 9M15 12l2 9"/>',
  shoulder:'<path d="M12 3a2 2 0 100 4 2 2 0 000-4z"/><path d="M5 9l7-2 7 2M12 7v8M9 21l3-6 3 6"/>',
  mobility:'<path d="M12 3a2 2 0 100 4 2 2 0 000-4z"/><circle cx="12" cy="13" r="3"/><path d="M4 13h5M15 13h5M12 7v3"/>'
};

/* ============================================================
   EXERCISE LIBRARY
   tier: "key" (priority for the look) | "core" | "accessory"
   ============================================================ */
const EX = {

/* ---- SHOULDERS & CHEST (PUSH) ---- */
  ohp:{name:"Standing Overhead Press",group:"shoulder",tier:"key",equip:"Barbell",icon:"press",tempo:"2s down · drive up",
    muscles:["Front delts","Side delts","Triceps","Upper chest"],
    sub:["Seated DB Shoulder Press","Machine Shoulder Press","Push Press (for overload)"],
    why:"The #1 mass builder for round, capped shoulders — the muscle that does the most to widen your top half and create the V. Pressing from the floor also forces full-body bracing.",
    steps:["Set the bar at collarbone height. Grip just outside shoulder width, elbows slightly in front of the bar.","Unrack, step back, brace your abs and squeeze your glutes — ribs down, not flared.","Tuck the chin slightly and press the bar straight up past your face.","Once it clears your forehead, push your head 'through' so the bar finishes stacked over the mid-foot.","Lower under control to the collarbone. Re-brace each rep."],
    cues:["Squeeze glutes hard so you don't lean back into an incline press.","Wrists stacked over elbows over the bar.","Full lockout with biceps near the ears."],
    faults:["Leaning back and pressing forward instead of up.","Flaring the ribcage — kills the brace.","Half lockouts that skip the top-end delt work."]},

  dbpress:{name:"Seated DB Shoulder Press",group:"shoulder",tier:"core",equip:"Dumbbells",icon:"press",tempo:"2s down · controlled up",
    muscles:["Front delts","Side delts","Triceps"],
    sub:["Standing Overhead Press","Machine Shoulder Press","Arnold Press"],
    why:"A joint-friendly way to overload the shoulders with a longer range of motion than a barbell. Great for direct delt growth without needing to stabilize a full-body press.",
    steps:["Sit upright on a bench with back support, dumbbells at shoulder height, palms forward.","Brace the core and keep a slight natural arch.","Press the dumbbells up and slightly together until the arms are nearly locked.","Stop just short of clashing the bells.","Lower under control until the elbows are level with the shoulders."],
    cues:["Don't bounce out of the bottom — control the stretch.","Keep the elbows slightly in front of the body, not flared straight out.","Wrists stacked over the elbows."],
    faults:["Excessive lower-back arch to heave the weight.","Half reps that never reach a real stretch.","Banging the dumbbells together at the top."]},

  inclinebb:{name:"Incline Barbell Press",group:"shoulder",tier:"key",equip:"Barbell",icon:"press",tempo:"2s down · drive up",
    muscles:["Upper chest","Front delts","Triceps"],
    sub:["Incline DB Press","Smith Incline Press","Weighted Dip (lean forward)"],
    why:"Upper-chest fullness is the 'armor' that fills out a shirt and ties the chest into the shoulders. The incline builds the shelf without overdeveloping the droopy lower chest.",
    steps:["Set the bench to ~30° (low incline — steeper turns it into a shoulder press).","Plant the feet, slight arch, shoulder blades pulled back and down.","Lower the bar to the upper chest, elbows tucked ~45°.","Drive up and slightly back so it finishes over the upper chest.","Control the 2-second descent."],
    cues:["Shoulder blades pinned the whole set.","Touch the upper chest, not the throat.","Press the body away from the bar."],
    faults:["Bench too steep.","Elbows flared to 90°.","Bouncing the bar off the chest."]},

  inclinedb:{name:"Incline Dumbbell Press",group:"shoulder",tier:"core",equip:"Dumbbells",icon:"press",tempo:"2s down · controlled up",
    muscles:["Upper chest","Front delts","Triceps"],
    sub:["Incline Barbell Press","Machine Incline Press"],
    why:"The dumbbell version gives a deeper stretch and an even contraction across both sides — excellent for building a symmetrical upper-chest shelf.",
    steps:["Bench at ~30°, dumbbells at the upper chest, palms forward.","Shoulder blades pulled back and down.","Press up and slightly in until nearly locked.","Lower under control to a deep but pain-free stretch.","Keep tension — don't rest the bells on the chest."],
    cues:["Slight arc inward at the top.","Full, controlled stretch at the bottom.","Elbows ~45°, not flared."],
    faults:["Dropping into the stretch with no control.","Pressing straight up and out (loses chest tension).","Clashing the dumbbells."]},

  flatdb:{name:"Flat Dumbbell Press",group:"shoulder",tier:"core",equip:"Dumbbells",icon:"press",tempo:"2s down · drive up",
    muscles:["Mid chest","Front delts","Triceps"],
    sub:["Flat Barbell Bench","Machine Chest Press","Weighted Dip"],
    why:"Builds overall chest thickness to balance the upper-chest work. Dumbbells keep the shoulders safer than a barbell and allow a fuller range.",
    steps:["Lie flat, dumbbells at chest level, shoulder blades retracted.","Feet planted, slight natural arch.","Press up and slightly together to near lockout.","Lower under control to a chest-level stretch.","Keep constant tension."],
    cues:["Retract the shoulder blades to protect the joint.","Don't lock out and rest — keep it moving.","Elbows ~45° from the torso."],
    faults:["Flaring elbows to 90°.","Bouncing off the chest.","Letting the shoulders roll forward."]},

  dip:{name:"Weighted Dip",group:"shoulder",tier:"key",equip:"Dip bars + belt",icon:"press",tempo:"2s down · drive up",
    muscles:["Lower/outer chest","Triceps","Front delts"],
    sub:["Machine Dip","Close-grip Bench","Bodyweight Dip"],
    why:"A heavy compound that adds chest and triceps size fast. A slight forward lean rounds out the chest beneath the upper-chest shelf.",
    steps:["Mount the bars, arms locked, chest up, slight forward lean for chest.","Lower until the upper arms are about parallel to the floor.","Keep the elbows tracking back, not flared wide.","Press to a strong lockout, squeezing chest and triceps.","Add weight once 8–10 clean reps are easy."],
    cues:["Forward lean = chest; upright = triceps.","Don't sink below a comfortable shoulder stretch.","Controlled, no bottom bounce."],
    faults:["Going too deep and straining the shoulder.","Flaring elbows.","Half reps to chase weight."]},

  latraise:{name:"Dumbbell Lateral Raise",group:"shoulder",tier:"key",equip:"Dumbbells",icon:"shoulder",tempo:"1s up · 3s down",
    muscles:["Side delts"],
    sub:["Cable Lateral Raise","Lean-away Cable Raise","Machine Lateral Raise"],
    why:"The single most important move for width. Side-delt growth widens your frame and, by contrast, shrinks the waist — the core of the V-taper illusion. Most physiques are limited here, so train it often.",
    steps:["Dumbbells at your sides, a slight fixed bend in the elbows.","Lean forward ~10° to bias the side delt; tilt the pinky slightly up.","Raise out to the sides until the wrists reach shoulder height — no higher.","Lead with the elbows, not the hands.","Lower slowly over 3 seconds."],
    cues:["Light weight, perfect form.","Pause a beat at the top.","Push the weights away from you, not just up."],
    faults:["Swinging / shrugging the traps.","Going too heavy (turns into an upright row).","Raising above shoulder height."]},

  cablelat:{name:"Cable Lateral Raise",group:"shoulder",tier:"core",equip:"Cable",icon:"shoulder",tempo:"1s up · 3s down",
    muscles:["Side delts"],
    sub:["Dumbbell Lateral Raise","Machine Lateral Raise"],
    why:"The cable keeps tension on the side delt through the entire range — including the bottom, where dumbbells go light. Excellent for adding width and shoulder detail.",
    steps:["Stand side-on to a low pulley, cable in the far hand across the body.","Slight lean away from the stack.","Raise the arm out to shoulder height, leading with the elbow.","Pause at the top.","Lower slowly, resisting the cable all the way down."],
    cues:["Keep the working shoulder down, away from the ear.","Constant tension — don't let the stack rest.","Smooth, never jerky."],
    faults:["Using the whole body to swing.","Letting the cable yank the arm down.","Shrugging the trap up."]},

  pushdown:{name:"Triceps Rope Pushdown",group:"shoulder",tier:"accessory",equip:"Cable + rope",icon:"press",tempo:"controlled",
    muscles:["Triceps"],
    sub:["Overhead Cable Extension","Close-grip Push-up","Bench Dip"],
    why:"Most of arm size is triceps. This isolation carves the horseshoe detail and finishes the arm.",
    steps:["Rope at the top. Pin the elbows to your sides.","Push down and spread the rope at the bottom.","Fully lock out and squeeze.","Control back up to ~90° at the elbow.","Keep the torso upright."],
    cues:["Elbows glued to the ribs.","Spread the rope at the bottom.","Slow negatives."],
    faults:["Elbows drifting forward.","Leaning over to push the weight.","Using the shoulders."]},

  ohext:{name:"Overhead Cable Triceps Extension",group:"shoulder",tier:"accessory",equip:"Cable + rope",icon:"press",tempo:"3s stretch",
    muscles:["Triceps (long head)"],
    sub:["Triceps Pushdown","Skull Crusher","DB Overhead Extension"],
    why:"The overhead position stretches the long head of the triceps — the part that adds visible mass to the back of the arm. A loaded stretch is a powerful growth stimulus.",
    steps:["Face away from a high pulley, rope overhead, elbows by the ears.","Lean forward slightly with a staggered stance.","Extend the arms fully forward and up.","Squeeze the triceps at lockout.","Lower to a deep stretch behind the head."],
    cues:["Keep the elbows tucked and high.","Chase the stretch at the bottom.","Move only at the elbow."],
    faults:["Elbows flaring wide.","Short range that skips the stretch.","Using the back to throw the weight."]},

/* ---- BACK & ARMS (PULL) ---- */
  pullup:{name:"Weighted Pull-Up",group:"pull",tier:"key",equip:"Bar + belt",icon:"pull",tempo:"control up · 2s down",
    muscles:["Lats","Upper back","Biceps"],
    sub:["Lat Pulldown","Assisted Pull-up","Chin-up"],
    why:"Builds the wide lats that taper to the waist — the back half of the V. Adding weight over time is what separates a strong-looking back from a flat one.",
    steps:["Grip slightly wider than shoulders.","From a dead hang, pull the shoulder blades down and back first.","Drive the elbows toward the hips, chest to the bar.","Pause with the collarbone near the bar.","Lower all the way to a full hang."],
    cues:["Lead with the chest, not the chin.","'Elbows to back pockets' to fire the lats.","Add belt weight once you hit 8 clean reps."],
    faults:["Half reps / no dead hang.","Kipping and swinging.","Shrugging up instead of pulling down."]},

  chinup:{name:"Chin-Up",group:"pull",tier:"core",equip:"Bar (+belt)",icon:"pull",tempo:"control up · 2s down",
    muscles:["Lats","Biceps","Upper back"],
    sub:["Weighted Pull-up","Lat Pulldown (underhand)"],
    why:"The underhand grip hammers the biceps alongside the lats — a two-for-one that builds both back width and arm size.",
    steps:["Grip shoulder-width, palms facing you.","Dead hang, then pull the shoulder blades down.","Pull until the chin clears the bar, chest up.","Squeeze at the top.","Lower to a full hang under control."],
    cues:["Drive the elbows down and in.","Full range every rep.","Add weight as you get strong."],
    faults:["Partial reps.","Swinging for momentum.","Not reaching a full hang."]},

  pulldown:{name:"Lat Pulldown",group:"pull",tier:"core",equip:"Cable machine",icon:"pull",tempo:"2s down · 2s up",
    muscles:["Lats","Upper back","Biceps"],
    sub:["Weighted Pull-up","Chin-up"],
    why:"Lets you train the pull-up pattern with adjustable load and chase the stretch and squeeze — great for building lat width when bodyweight pull-ups are limiting.",
    steps:["Set the thigh pad, grip slightly wider than shoulders.","Sit tall, slight lean back, chest up.","Pull the bar to the upper chest, driving the elbows down.","Squeeze the lats at the bottom.","Control the bar back up to a full stretch overhead."],
    cues:["Pull with the elbows, not the hands.","Full overhead stretch each rep.","Don't lean back excessively."],
    faults:["Heaving with the torso.","Pulling behind the neck.","Short reps with no stretch."]},

  bbrow:{name:"Barbell Row",group:"pull",tier:"key",equip:"Barbell",icon:"pull",tempo:"control · squeeze",
    muscles:["Mid-back","Lats","Rear delts","Biceps"],
    sub:["Pendlay Row","Chest-supported Row","Seated Cable Row"],
    why:"Adds thickness and detail to the back and pulls the shoulders back for the upright posture that amplifies the whole physique.",
    steps:["Hinge to ~45°, flat back, soft knees.","Let the bar hang with shoulders slightly forward.","Pull to the lower ribs / belly button, elbows driving back.","Squeeze the shoulder blades at the top.","Lower under control to a stretch."],
    cues:["Pull to the waist, not the chest.","Fixed torso angle — no jerking up.","Squeeze, don't yank."],
    faults:["Using the lower back to heave.","Rounding the spine.","Short, partial reps."]},

  cablerow:{name:"Seated Cable Row",group:"pull",tier:"core",equip:"Cable machine",icon:"pull",tempo:"2s squeeze · 2s stretch",
    muscles:["Mid-back","Lats","Rear delts","Biceps"],
    sub:["Chest-supported Row","Single-arm DB Row","Barbell Row"],
    why:"A back-friendly way to build mid-back thickness with constant tension and a big stretch — easy to progressively overload safely.",
    steps:["Sit tall, slight knee bend, grab the handle.","Start with the arms extended and a slight forward lean for stretch.","Pull to the navel, driving the elbows straight back.","Squeeze the shoulder blades together.","Return to a full stretch under control."],
    cues:["Lead with the elbows.","Big stretch at the front, hard squeeze at the back.","Keep the torso mostly still."],
    faults:["Rowing with the lower back.","Shrugging the shoulders up.","Cutting the stretch short."]},

  dbrow:{name:"Single-Arm Dumbbell Row",group:"pull",tier:"core",equip:"Dumbbell + bench",icon:"pull",tempo:"control · squeeze",
    muscles:["Lats","Mid-back","Rear delts","Biceps"],
    sub:["Chest-supported Row","Seated Cable Row"],
    why:"Single-arm work corrects side-to-side imbalances and lets you really stretch and contract each lat through a long range.",
    steps:["One hand and knee on a bench, flat back, dumbbell hanging.","Let the shoulder stretch forward at the bottom.","Pull the dumbbell to the hip, elbow driving back.","Squeeze the lat at the top.","Lower to a full stretch. Finish all reps, then switch."],
    cues:["Pull toward the hip, not the armpit.","Don't rotate the torso to cheat.","Full stretch each rep."],
    faults:["Yanking with body english.","Short range.","Rounding the back."]},

  facepull:{name:"Face Pull",group:"pull",tier:"core",equip:"Cable + rope",icon:"pull",tempo:"controlled",
    muscles:["Rear delts","Rotator cuff","Traps"],
    sub:["Rear Delt Fly","Band Pull-apart"],
    why:"Rear-delt and upper-back work that bulletproofs the shoulders and fixes the rounded posture caused by heavy pressing. Healthy shoulders = more pressing = bigger delts. It also rounds out the 3D look of the delts from behind.",
    steps:["Rope at face height, thumbs pointing back.","Step back to tension, arms straight.","Pull toward the eyes, splitting the rope apart.","Finish with knuckles by the ears, elbows high.","Return slowly to the stretch."],
    cues:["High elbows throughout.","Finish in a double-biceps pose.","Pure control — never ego-load."],
    faults:["Pulling low (turns into a row).","Leaning back and using bodyweight.","Too heavy, losing external rotation."]},

  reardelt:{name:"Rear Delt Fly",group:"pull",tier:"accessory",equip:"Dumbbells / Pec deck",icon:"shoulder",tempo:"1s up · 2s down",
    muscles:["Rear delts","Upper back"],
    sub:["Face Pull","Reverse Pec Deck"],
    why:"Directly builds the rear delts that complete a round, 3D shoulder and balance out all the front-delt pressing — key for the capped, full look from every angle.",
    steps:["Hinge forward with light dumbbells hanging down (or use the reverse pec deck).","Slight fixed elbow bend.","Raise the arms out to the sides, leading with the elbows.","Squeeze the rear delts at the top.","Lower slowly."],
    cues:["Think 'pour the weights out to the sides.'","Keep the neck relaxed.","Light and strict."],
    faults:["Using momentum.","Turning it into a row.","Shrugging the traps."]},

  inclinecurl:{name:"Incline Dumbbell Curl",group:"pull",tier:"core",equip:"Dumbbells",icon:"pull",tempo:"1s up · 3s down",
    muscles:["Biceps (long head)","Forearms"],
    sub:["Standing DB Curl","Cable Curl"],
    why:"The incline stretches the long head of the biceps for the peak that reads on camera — one of the best curl variations for visible arm size.",
    steps:["Bench at ~60°, arms hanging straight down behind the torso.","Keep the upper arms still — the stretch is the point.","Curl up, rotating the pinky toward you.","Squeeze hard at the top.","Lower all the way to a full stretch (3s)."],
    cues:["Don't let the elbows drift forward.","Own the negative.","Full stretch every rep."],
    faults:["Swinging the elbows forward.","Half reps.","Dropping the weight fast."]},

  bbcurl:{name:"Barbell Curl",group:"pull",tier:"accessory",equip:"Barbell / EZ bar",icon:"pull",tempo:"1s up · 2s down",
    muscles:["Biceps","Forearms"],
    sub:["Cable Curl","Incline DB Curl"],
    why:"Lets you load the biceps heaviest for overall arm mass. The EZ bar is kinder to the wrists.",
    steps:["Stand tall, grip shoulder-width, elbows pinned to the sides.","Curl up without swinging the elbows forward.","Squeeze at the top.","Lower under control to full extension.","Keep the torso still."],
    cues:["Elbows stay put.","No back-swing.","Full extension at the bottom."],
    faults:["Heaving with the lower back.","Elbows drifting forward.","Partial reps."]},

  hammercurl:{name:"Hammer Curl",group:"pull",tier:"accessory",equip:"Dumbbells",icon:"pull",tempo:"1s up · 2s down",
    muscles:["Biceps (brachialis)","Forearms"],
    sub:["Cable Rope Curl","Reverse Curl"],
    why:"Targets the brachialis under the biceps and the forearm — adding width and thickness to the arm that makes it look fuller from every angle.",
    steps:["Dumbbells at your sides, palms facing in (neutral).","Elbows pinned, curl up keeping the neutral grip.","Squeeze at the top.","Lower under control.","Alternate or do both together."],
    cues:["Keep the thumbs up the whole time.","No swinging.","Control the lowering."],
    faults:["Using momentum.","Letting the elbows drift.","Half reps."]},

/* ---- LEGS ---- */
  squat:{name:"Back Squat",group:"legs",tier:"key",equip:"Barbell + rack",icon:"legs",tempo:"2s down · drive up",
    muscles:["Quads","Glutes","Core"],
    sub:["Front Squat","Goblet Squat","Leg Press"],
    why:"The foundation of strong, athletic legs and a major driver of the whole-body anabolic response. Trained hard but with controlled volume so legs stay proportioned, not blocky.",
    steps:["Bar on the upper traps, feet shoulder-width, toes slightly out.","Brace the core, break at the hips and knees together.","Descend until the thighs are at least parallel, knees over the toes.","Drive through the mid-foot to stand, squeezing the glutes.","Keep the chest up and spine neutral."],
    cues:["Knees out, tracking the toes.","Brace as if about to be punched.","Full depth beats heavy half-reps."],
    faults:["Knees caving in.","Rounding the lower back.","Hips rising first."]},

  frontsquat:{name:"Front Squat",group:"legs",tier:"core",equip:"Barbell + rack",icon:"legs",tempo:"2s down · drive up",
    muscles:["Quads","Core","Upper back"],
    sub:["Goblet Squat","Back Squat","Leg Press"],
    why:"Shifts the load to the quads and forces an upright torso — building the teardrop quad sweep while sparing the lower back.",
    steps:["Bar on the front delts, elbows high, light fingertip grip.","Feet shoulder-width, toes slightly out.","Sit straight down, keeping the elbows up.","Hit at least parallel.","Drive up through the mid-foot."],
    cues:["Elbows up — if they drop, the bar rolls forward.","Stay tall through the torso.","Brace hard."],
    faults:["Elbows dropping.","Rounding forward.","Heels rising."]},

  goblet:{name:"Goblet Squat",group:"legs",tier:"core",equip:"Dumbbell / KB",icon:"legs",tempo:"2s down · drive up",
    muscles:["Quads","Glutes","Core"],
    sub:["Front Squat","Leg Press","Back Squat"],
    why:"The easiest squat to learn and a great option for a medium gym. Holding the weight up front keeps you upright and teaches perfect mechanics.",
    steps:["Hold a dumbbell vertically against the chest.","Feet shoulder-width, toes slightly out.","Sit down between the legs, elbows inside the knees.","Hit depth with the chest tall.","Drive up through the heels."],
    cues:["Elbows brush the inside of the knees at the bottom.","Chest proud throughout.","Push the knees out."],
    faults:["Rounding forward.","Heels lifting.","Cutting depth short."]},

  legpress:{name:"Leg Press",group:"legs",tier:"core",equip:"Machine",icon:"legs",tempo:"2s down · drive up",
    muscles:["Quads","Glutes"],
    sub:["Hack Squat","Goblet Squat","Back Squat"],
    why:"Lets you safely overload the legs with no balance or lower-back demand — ideal for adding quad and glute size with high effort.",
    steps:["Feet shoulder-width on the platform, mid-height.","Lower the safeties, control the sled down.","Bring the knees toward the chest without the lower back rounding off the pad.","Drive through the whole foot.","Stop just short of locking the knees."],
    cues:["Don't let the lower back lift off the pad.","Control the negative.","Knees track the toes."],
    faults:["Bouncing at the bottom.","Locking out and resting.","Half reps with too much weight."]},

  bss:{name:"Bulgarian Split Squat",group:"legs",tier:"core",equip:"Dumbbells + bench",icon:"legs",tempo:"2s down · drive up",
    muscles:["Quads","Glutes","Balance"],
    sub:["Walking Lunge","Leg Press (single)","Step-up"],
    why:"Single-leg work builds balanced, athletic legs and strong glutes while sparing the lower back — perfect for the lean, capable look.",
    steps:["Top of the rear foot on a bench behind you.","Dumbbells at the sides, torso tall.","Lower straight down until the front thigh is parallel.","Front knee tracks over the foot.","Drive through the front heel. Finish reps, then switch."],
    cues:["Weight on the front leg.","Slight lean for glutes, upright for quads.","Control the descent."],
    faults:["Front knee caving.","Pushing off the back foot.","Stance too short."]},

  rdl:{name:"Romanian Deadlift",group:"legs",tier:"key",equip:"Barbell / DB",icon:"legs",tempo:"3s down · drive up",
    muscles:["Hamstrings","Glutes","Lower back"],
    sub:["DB RDL","Leg Curl","Good Morning"],
    why:"Builds the hamstrings and glutes that complete the legs from the side and back, and reinforces a powerful hip hinge for everyday athleticism.",
    steps:["Stand tall holding the bar at the hips, soft knees.","Push the hips straight back, sliding the bar down the thighs.","Lower to a strong hamstring stretch (mid-shin), back flat.","Keep the bar against the legs.","Drive the hips forward to stand, squeezing the glutes."],
    cues:["Hinge, don't squat — hips back.","Flat back, chest proud.","Feel the hamstrings, not the lower back."],
    faults:["Rounding the back.","Bending the knees too much.","Bar drifting away."]},

  legcurl:{name:"Lying / Seated Leg Curl",group:"legs",tier:"accessory",equip:"Machine",icon:"legs",tempo:"1s up · 3s down",
    muscles:["Hamstrings"],
    sub:["Nordic Curl","Romanian Deadlift"],
    why:"Directly isolates the hamstrings' knee-flexion function that RDLs miss — for fully developed, balanced legs.",
    steps:["Set the pad above the heels, align the knee with the pivot.","Curl the heels toward the glutes.","Squeeze hard at the top.","Lower slowly over 3 seconds.","Keep the hips down on the pad."],
    cues:["No hip lifting to cheat.","Squeeze at full contraction.","Slow negatives."],
    faults:["Bouncing the weight.","Lifting the hips.","Partial range."]},

  legext:{name:"Leg Extension",group:"legs",tier:"accessory",equip:"Machine",icon:"legs",tempo:"1s up · 2s down",
    muscles:["Quads"],
    sub:["Goblet Squat","Leg Press"],
    why:"Isolates the quads — especially the teardrop near the knee — for detailed, sweeping thighs.",
    steps:["Align the knees with the pivot, pad on the lower shin.","Extend to full lockout.","Squeeze the quads hard at the top.","Lower under control.","Keep the hips in the seat."],
    cues:["Pause and squeeze at the top.","Don't slam the weight down.","Point the toes slightly up."],
    faults:["Using momentum.","Half reps.","Lifting the hips off the seat."]},

  calf:{name:"Standing Calf Raise",group:"legs",tier:"accessory",equip:"Machine / DB",icon:"legs",tempo:"1s up · pause · 2s down",
    muscles:["Calves (gastrocnemius)"],
    sub:["Seated Calf Raise","Single-leg DB Raise"],
    why:"Defined calves finish the legs and are visible year-round. They respond to a deep stretch and a hard squeeze through a full range.",
    steps:["Balls of the feet on a step, heels hanging off.","Drop the heels for a deep stretch.","Press up onto the toes as high as possible.","Squeeze hard at the top for a full second.","Lower slowly all the way down."],
    cues:["Full range — deep stretch, high squeeze.","Pause top and bottom.","Slow and controlled."],
    faults:["Tiny bouncy reps.","Rushing the negative.","Bending the knees to bounce."]},

/* ---- CORE & WAIST ---- */
  legraise:{name:"Hanging Leg Raise",group:"core",tier:"key",equip:"Pull-up bar",icon:"core",tempo:"controlled",
    muscles:["Lower abs","Hip flexors","Grip"],
    sub:["Captain's Chair Raise","Lying Leg Raise","Reverse Crunch"],
    why:"Direct lower-ab work that builds the visible six-pack while keeping the waist tight rather than thick — important for the tapered look.",
    steps:["Hang with the shoulders slightly pulled down.","Brace and tilt the pelvis to start.","Raise the legs until the thighs pass parallel (bend knees to scale).","Control the lift — no swinging.","Lower slowly to a dead hang."],
    cues:["Curl the pelvis up, don't just lift the legs.","Slow on the way down.","Bend the knees if you swing."],
    faults:["Swinging for momentum.","Only moving at the hips.","Dropping the legs fast."]},

  abwheel:{name:"Ab Wheel Rollout",group:"core",tier:"core",equip:"Ab wheel",icon:"core",tempo:"slow & controlled",
    muscles:["Full core","Lats"],
    sub:["Plank","Cable Crunch"],
    why:"Builds true core strength and a flat, dense midsection that holds you tall — the anti-bloat, tight-waist exercise.",
    steps:["Kneel, grip the wheel under the shoulders, brace hard.","Tuck the pelvis and roll forward slowly in a hollow position.","Go only as far as you can hold a flat back.","Pull through the abs and lats to return.","Keep tension the entire range."],
    cues:["Ribs down, glutes squeezed — resist the arch.","Short range first; extend over time.","Own every inch."],
    faults:["Lower back sagging (injury risk).","Rolling too far too soon.","Pulling with the hips."]},

  cablecrunch:{name:"Cable Crunch",group:"core",tier:"accessory",equip:"Cable + rope",icon:"core",tempo:"1s crunch · 2s up",
    muscles:["Abs (rectus)"],
    sub:["Hanging Leg Raise","Weighted Crunch"],
    why:"Lets you progressively overload the abs like any other muscle — building thicker, more visible six-pack blocks without thickening the waist sideways.",
    steps:["Kneel below a high pulley, rope at the forehead.","Hinge down by crunching the ribs toward the pelvis.","Round the spine — it's a crunch, not a hip fold.","Squeeze the abs hard at the bottom.","Return under control to a stretch."],
    cues:["Move from the abs, not the hips.","Curl the spine like a 'C'.","Keep the hips fixed."],
    faults:["Hip-hinging instead of crunching.","Using the arms to pull.","Yanking the weight."]},

  plank:{name:"Hardstyle Plank",group:"core",tier:"accessory",equip:"None",icon:"core",tempo:"10–20s max tension",
    muscles:["Deep core","Glutes"],
    sub:["Ab Wheel","Hollow Hold"],
    why:"Teaches the full-body bracing that protects your spine on every heavy lift and keeps the midsection tight under load.",
    steps:["Forearms under the shoulders, body in a straight line.","Squeeze the glutes and quads hard.","Brace the abs as if bracing for a punch.","Pull the elbows 'toward your toes' for max tension.","Hold 10–20s of true tension, not long easy holds."],
    cues:["Maximal tension, not maximal time.","Flat back — no sag or pike.","Shallow breaths behind the brace."],
    faults:["Sagging hips.","Holding limp for minutes.","Dropping the head."]},

  vacuum:{name:"Stomach Vacuum",group:"core",tier:"accessory",equip:"None",icon:"core",tempo:"15–30s holds",
    muscles:["Transverse abdominis"],
    sub:["Hollow Hold","Dead Bug"],
    why:"Trains the deep inner-corset muscle (transverse abdominis) that pulls the waist in tighter — a classic golden-era tool for that small, controlled waistline.",
    steps:["Stand or kneel tall. Exhale all your air out.","Pull the navel in and up toward the spine.","Hold the 'hollow' without breathing in for 15–30s.","Breathe shallow if needed while keeping tension.","Relax and repeat for several rounds."],
    cues:["Fully empty the lungs first.","Pull the belly button to the spine.","Practice daily for a tighter waist."],
    faults:["Holding the breath in (the opposite of the goal).","Hunching over.","Straining the neck."]}
};

/* ============================================================
   PHYSIQUE ARCHETYPES — the looks you can aim for
   ============================================================ */
const ARCHETYPES = {
  fighter:{
    name:"The Fighter",
    tag:"Lean · sharp · defined",
    ref:"The stripped-down, low-body-fat look made famous by leading men in fight-sport roles — not big, but extremely defined.",
    bodyfat:"7–10%",
    look:"Visible abs, sharp lines, vascular, stage-lean. More 'cut' than 'big'. Looks dramatic shirtless, lean and wiry in clothes.",
    suits:"Smaller frames, people who want maximum definition over size, or a 12-week 'get shredded' goal.",
    emphasis:["Get and stay very lean","Hard, dense core","Visible shoulder + arm detail","Conditioning / steps"],
    program:"foundation",
    horizon:"Achievable in 3–6 months if you're already near 15% body fat.",
    metrics:{shoulderWaist:"1.5+",bodyfat:"7–10%"}
  },
  leadingman:{
    name:"The Leading Man",
    tag:"The Hollywood default",
    ref:"The balanced, classic leading-man build: lean, proportioned, broad on top, great in or out of a shirt. The most universally attractive and most achievable target.",
    bodyfat:"10–12%",
    look:"Clear V-taper, full upper chest, capped shoulders, tight waist, visible-but-not-shredded abs. Looks athletic and polished in clothes, impressive shirtless.",
    suits:"Almost everyone. This is the recommended default — the best ratio of looks to sustainability.",
    emphasis:["Shoulders (especially side delts)","Back width (lats)","Upper chest","Lean, tight waist"],
    program:"greekgod",
    horizon:"1–2 years of consistent training from untrained; faster if already lean.",
    metrics:{shoulderWaist:"1.55–1.6",bodyfat:"10–12%"}
  },
  greekgod:{
    name:"The Greek God",
    tag:"Classic proportion · golden ratio",
    ref:"The timeless, statuesque ideal — full, balanced development built to classic proportions. Strong without being a mass-monster.",
    bodyfat:"9–12%",
    look:"Fuller muscle bellies everywhere, perfect proportions, peak golden-ratio shoulder-to-waist. The 'carved from marble' look.",
    suits:"People who've built a base and want a fuller, more powerful version of the leading-man look.",
    emphasis:["Full, balanced development","Golden-ratio proportions","Strength milestones","Lagging-part priority"],
    program:"specialization",
    horizon:"2–4 years of dedicated, progressive training.",
    metrics:{shoulderWaist:"1.6–1.7",bodyfat:"9–12%"}
  },
  warrior:{
    name:"The Warrior",
    tag:"Bigger · denser · still lean",
    ref:"The larger 'epic role' build — noticeably more muscle while staying lean and proportioned. Size with shape.",
    bodyfat:"10–13%",
    look:"Significant overall mass, thick chest/back/arms, still tapered and lean. Fills a doorway but isn't a bloated bodybuilder.",
    suits:"Larger frames or anyone whose goal is more size, willing to eat and train more.",
    emphasis:["More total volume","Eat in a lean surplus","Heavy compound strength","Maintain the taper"],
    program:"specialization",
    horizon:"3–5+ years; requires more food and recovery.",
    metrics:{shoulderWaist:"1.6+",bodyfat:"10–13%"}
  }
};

/* ============================================================
   PROGRAMS
   ============================================================ */
const REST = {heavy:"3:00", mid:"2:00", light:"1:30"};

const PROGRAM = {
  foundation:{
    name:"Foundation",
    level:"Beginner",
    weeks:"Weeks 1–8",
    days:["3 days / week","Full-body strength base","Mon · Wed · Fri"],
    blurb:"Start here. Three full-body-leaning sessions that prioritize the shoulders, upper chest and back while you build baseline strength and groove perfect technique. Reverse-pyramid the big lifts: warm up, then your heaviest set first, dropping ~10% and adding reps each set after.",
    defaultWeek:{1:0,3:1,5:2},
    schedule:[
      {d:"Push",ex:[
        {ex:"ohp",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy,note:"Top set heavy. Drop ~10% each set."},
        {ex:"inclinedb",scheme:"3 × 6 / 8 / 10",rest:REST.heavy},
        {ex:"latraise",scheme:"3 × 12–15",rest:REST.light,note:"Add reps before weight."},
        {ex:"pushdown",scheme:"3 × 10–12",rest:REST.light},
      ]},
      {d:"Pull",ex:[
        {ex:"pullup",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy,note:"Add weight once you hit 8 clean."},
        {ex:"cablerow",scheme:"3 × 8 / 10 / 12",rest:REST.mid},
        {ex:"facepull",scheme:"3 × 15",rest:REST.light},
        {ex:"inclinecurl",scheme:"3 × 8–12",rest:REST.light},
      ]},
      {d:"Legs & Core",ex:[
        {ex:"squat",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"rdl",scheme:"3 × 8 / 10",rest:REST.mid},
        {ex:"calf",scheme:"3 × 12–15",rest:REST.light},
        {ex:"legraise",scheme:"3 × 10–15",rest:REST.light},
        {ex:"latraise",scheme:"2 × 15",rest:REST.light,note:"Bonus delts — they recover fast."},
      ]},
    ]
  },
  greekgod:{
    name:"Greek God Sculpt",
    level:"Intermediate",
    weeks:"Weeks 9–24",
    days:["4 days / week","Push · Pull · Legs · Upper","More delt & back volume"],
    blurb:"Once your top lifts are solid, this 4-day split adds an extra upper-body day to bring up the muscles that define the look — shoulders, chest and back. Keep reverse-pyramiding the first lift of each day; chase reps and the squeeze on the isolation work.",
    defaultWeek:{1:0,2:1,4:2,5:3},
    schedule:[
      {d:"Push",ex:[
        {ex:"inclinebb",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"ohp",scheme:"RPT · 6 / 8",rest:REST.heavy},
        {ex:"dip",scheme:"3 × 8–10",rest:REST.mid},
        {ex:"latraise",scheme:"4 × 12–15",rest:REST.light},
        {ex:"pushdown",scheme:"3 × 10–12",rest:REST.light},
      ]},
      {d:"Pull",ex:[
        {ex:"pullup",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"cablerow",scheme:"3 × 8 / 10 / 12",rest:REST.mid},
        {ex:"facepull",scheme:"3 × 15–20",rest:REST.light},
        {ex:"inclinecurl",scheme:"3 × 8–12",rest:REST.light},
        {ex:"hammercurl",scheme:"2 × 10–12",rest:REST.light},
      ]},
      {d:"Legs",ex:[
        {ex:"squat",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"rdl",scheme:"3 × 8 / 10",rest:REST.mid},
        {ex:"bss",scheme:"3 × 8–10 / leg",rest:REST.mid},
        {ex:"calf",scheme:"4 × 12–15",rest:REST.light},
        {ex:"abwheel",scheme:"3 × 8–12",rest:REST.light},
      ]},
      {d:"Upper (Aesthetic)",ex:[
        {ex:"dbpress",scheme:"3 × 8–10",rest:REST.mid,note:"Delt-focused day to bring up the shoulders."},
        {ex:"chinup",scheme:"3 × 6–8",rest:REST.mid},
        {ex:"cablelat",scheme:"4 × 12–15",rest:REST.light},
        {ex:"reardelt",scheme:"3 × 15",rest:REST.light},
        {ex:"inclinecurl",scheme:"3 × 10",rest:REST.light},
        {ex:"legraise",scheme:"3 × 12–15",rest:REST.light},
      ]},
    ]
  },
  specialization:{
    name:"Aesthetic Specialization",
    level:"Advanced",
    weeks:"Weeks 25+",
    days:["5 days / week","Maximum delt & back focus","For dedicated lifters"],
    blurb:"A 5-day plan for lifters with a real base who want to push the V-taper as far as it goes. High frequency on the visual money-makers — side delts and lats — with enough leg and arm work to stay proportioned. Only run this with solid recovery, sleep and nutrition dialed in.",
    defaultWeek:{1:0,2:1,3:2,5:3,6:4},
    schedule:[
      {d:"Chest & Side Delts",ex:[
        {ex:"inclinebb",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"flatdb",scheme:"3 × 8–10",rest:REST.mid},
        {ex:"dip",scheme:"3 × 8–10",rest:REST.mid},
        {ex:"cablelat",scheme:"4 × 12–15",rest:REST.light},
        {ex:"latraise",scheme:"3 × 15–20",rest:REST.light,note:"Drop-set the last set."},
      ]},
      {d:"Back Width & Thickness",ex:[
        {ex:"pullup",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"bbrow",scheme:"3 × 8 / 10",rest:REST.mid},
        {ex:"pulldown",scheme:"3 × 10–12",rest:REST.light},
        {ex:"cablerow",scheme:"3 × 10–12",rest:REST.light},
        {ex:"facepull",scheme:"4 × 15–20",rest:REST.light},
      ]},
      {d:"Legs",ex:[
        {ex:"squat",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"rdl",scheme:"3 × 8 / 10",rest:REST.mid},
        {ex:"legpress",scheme:"3 × 10–12",rest:REST.mid},
        {ex:"legcurl",scheme:"3 × 10–12",rest:REST.light},
        {ex:"calf",scheme:"4 × 12–15",rest:REST.light},
      ]},
      {d:"Shoulders & Arms",ex:[
        {ex:"ohp",scheme:"RPT · 5 / 6 / 8",rest:REST.heavy},
        {ex:"cablelat",scheme:"4 × 12–15",rest:REST.light},
        {ex:"reardelt",scheme:"3 × 15–20",rest:REST.light},
        {ex:"inclinecurl",scheme:"3 × 8–12",rest:REST.light},
        {ex:"ohext",scheme:"3 × 10–12",rest:REST.light},
        {ex:"hammercurl",scheme:"2 × 12",rest:REST.light},
      ]},
      {d:"Upper Pump & Core",ex:[
        {ex:"inclinedb",scheme:"3 × 10–12",rest:REST.mid},
        {ex:"dbrow",scheme:"3 × 10–12",rest:REST.mid},
        {ex:"latraise",scheme:"4 × 15–20",rest:REST.light},
        {ex:"abwheel",scheme:"3 × 10–12",rest:REST.light},
        {ex:"cablecrunch",scheme:"3 × 12–15",rest:REST.light},
        {ex:"vacuum",scheme:"4 × 20s",rest:REST.light,note:"For a tighter waist."},
      ]},
    ]
  }
};

/* ============================================================
   STRENGTH MILESTONES (natural intermediate→advanced goals)
   multipliers of bodyweight; framed as milestones, not requirements
   ============================================================ */
const STANDARDS = [
  {lift:"Standing Overhead Press",beginner:"0.45×",intermediate:"0.6×",advanced:"0.8×",note:"For reps. ~Bodyweight overhead for a single is elite-natural."},
  {lift:"Incline Bench Press",beginner:"0.6×",intermediate:"0.9×",advanced:"1.2×",note:"Top RPT set for ~5 reps."},
  {lift:"Weighted Pull-Up",beginner:"BW × 5",intermediate:"+25% BW",advanced:"+50% BW",note:"Added weight for ~5 clean reps."},
  {lift:"Back Squat",beginner:"1.0×",intermediate:"1.5×",advanced:"2.0×",note:"Top set for ~5 reps, full depth."},
  {lift:"Romanian Deadlift",beginner:"1.0×",intermediate:"1.5×",advanced:"2.0×",note:"Strict, full stretch."},
  {lift:"Chin-Up",beginner:"BW × 8",intermediate:"+20% BW",advanced:"+40% BW",note:"Added weight for ~5 reps."}
];

/* ============================================================
   BODY FAT VISUAL GUIDE
   ============================================================ */
const BODYFAT = [
  {range:"20%+",label:"Soft",desc:"Abs hidden under a layer of fat, little muscle separation, rounder waist. Start with a cut.",look:"none"},
  {range:"15–18%",label:"Average",desc:"Healthy but smooth. A flat stomach but no visible abs. Most untrained men live here.",look:"flat"},
  {range:"12–14%",label:"Athletic",desc:"Upper abs start to show, some separation in the shoulders and arms. Looks fit in clothes.",look:"some"},
  {range:"10–12%",label:"Lean (the sweet spot)",desc:"Clear V-taper, visible abs, defined shoulders. The target for the leading-man look — and it's maintainable.",look:"abs"},
  {range:"8–9%",label:"Shredded",desc:"Sharp lines everywhere, full six-pack, vascularity. The 'premiere night' peak — harder to hold long-term.",look:"shredded"},
  {range:"<7%",label:"Stage / unsustainable",desc:"Striated, paper-thin skin. Looks dramatic on camera for a day but is not healthy to maintain.",look:"stage"}
];

/* ============================================================
   ACADEMY — deep, accurate articles
   ============================================================ */
const LEARN = [
  {id:"vtaper",title:"The Science of the V-Taper",read:"5 min",tag:"Aesthetics",
   intro:"Why the V-shape is the single most important thing you can build — and the actual math behind it.",
   body:[
     {h:"It's the strongest signal of a great male physique",p:"Across decades of attractiveness research, one body trait predicts perceived male physical attractiveness better than almost any other: a high shoulder-to-waist ratio. Broad shoulders tapering to a narrow waist read as healthy, strong and athletic to basically everyone, in every culture. That V-shape — not sheer size — is what your eye registers as a 'great body.'"},
     {h:"The golden ratio target",p:"The classic aesthetic ideal is a shoulder circumference about 1.6 times your waist circumference — the 'golden ratio' (1.618) applied to the body, sometimes called the Adonis Index. You don't need to hit it exactly; even getting to ~1.5 transforms how you look. Two levers move this ratio: build the shoulders and lats wider, and keep the waist lean and tight."},
     {h:"The waist matters as much as the shoulders",p:"Because the ratio is shoulders ÷ waist, a smaller waist improves it just as much as bigger delts. That's why staying lean and not over-thickening the midsection (no heavy loaded side bends, careful with very heavy ab work) is part of the strategy. A 10–12% body-fat waist makes average shoulders look great; a soft waist makes great shoulders look ordinary."},
     {h:"Build these, in order of impact",p:"1) Side delts — the biggest lever for width. 2) Lats — width from behind and the taper into the waist. 3) Upper chest — fills out the front and ties into the shoulders. 4) A lean, tight waist. 5) Arms and legs to finish the proportions. Train in roughly that priority and you build the look efficiently."}
   ]},
  {id:"vsbodybuilder",title:"Movie Star vs. Bodybuilder",read:"4 min",tag:"Mindset",
   intro:"Why chasing the leading-man look is a different game from chasing maximum size — and why that's good news.",
   body:[
     {h:"Proportion beats mass",p:"Bodybuilding optimizes for total muscle in every region, including the waist, traps and legs, which can actually blunt the V-taper and the 'clothes-on' look. The movie-star aesthetic optimizes for proportion and leanness instead. You are building a specific shape, not just more of everything."},
     {h:"You need less muscle than you think",p:"Many leading men carry far less muscle than a competitive bodybuilder — they just carry it in the right places at a low body fat. That's why this look is realistic to build naturally in a few years, while extreme bodybuilder size usually is not without drugs."},
     {h:"Leanness is the multiplier",p:"The same amount of muscle looks dramatically better at 10% body fat than at 18%. Getting and staying lean is often the fastest visible upgrade for someone who already trains."},
     {h:"What you de-prioritize",p:"Direct heavy trap work, heavy loaded oblique work, and chasing a huge waist-thickening 'powerlifter gut' all work against the aesthetic. Train legs for health and proportion, but you don't need tree-trunk quads to look like a leading man."}
   ]},
  {id:"bodyfat",title:"Body Fat: The Real Difference Maker",read:"5 min",tag:"Nutrition",
   intro:"What each body-fat level actually looks like, and how to get to the lean sweet spot.",
   body:[
     {h:"The look lives at 10–12%",p:"Visible abs, a clear V-taper and defined shoulders show up around 10–12% body fat for most men. That range is both impressive and maintainable. Sub-8% looks dramatic on camera but is hard and not very healthy to hold year-round. Don't chase a number you can't live at."},
     {h:"How fast to lose it",p:"Aim to lose about 0.5–1% of your bodyweight per week. Faster than that and you start losing muscle — the exact thing that creates your shape. A 180 lb man should target roughly 1–1.5 lb of fat loss per week, no more."},
     {h:"How to actually do it",p:"Eat in a modest calorie deficit (about 15–20% below maintenance), keep protein high (~0.8–1 g per lb of bodyweight), keep lifting heavy so the weight you lose is fat not muscle, and walk daily. An 8-hour eating window (e.g. noon–8pm) is an easy way to control calories without counting everything."},
     {h:"Be patient near the end",p:"The last few percent of body fat is the slowest and requires the most discipline. Hold a small deficit, prioritize sleep and protein, and let it come off gradually."}
   ]},
  {id:"rpt",title:"Reverse Pyramid Training",read:"4 min",tag:"Training",
   intro:"The simple, time-efficient way to get strong and build the look — explained.",
   body:[
     {h:"What it is",p:"After warming up, you do your heaviest set first while you're fresh, then reduce the weight about 10% and add a rep or two for each following set. Example: 100 × 5, then 90 × 6, then 80 × 8."},
     {h:"Why it works",p:"Your top set is your highest-quality, heaviest effort when you're least fatigued — that drives strength and growth. The lighter back-off sets add volume without burning you out. It's efficient: a few hard sets per lift is plenty."},
     {h:"How to progress",p:"When you hit the top of the rep range on your first set (say all 6 of a 5–6 target), add the smallest possible weight next session. This 'double progression' is the engine of the whole program. Log every set so you know what to beat."},
     {h:"Use it on the big lifts only",p:"Reverse-pyramid the main compound lifts (presses, pull-ups, squats, rows). For isolation work — lateral raises, curls, pushdowns — just chase reps and a strong contraction in a fixed rep range; don't bother pyramiding."}
   ]},
  {id:"overload",title:"Progressive Overload: The One Rule",read:"3 min",tag:"Training",
   intro:"If you only understand one training principle, make it this one.",
   body:[
     {h:"Muscle grows in response to doing more over time",p:"To keep growing, you must gradually give the muscle more than it's used to — more weight, more reps, or more quality sets. A program is just a structured way to add a little more, consistently, for years."},
     {h:"The simplest version",p:"Beat your logbook. Add a rep, or a little weight, on your key lifts whenever you can. Tiny improvements, repeated over months, are what build a physique. This is why logging your sets in this app matters — you can't beat a number you didn't record."},
     {h:"It slows down — that's normal",p:"Beginners can add weight almost every session. Intermediates progress weekly to monthly. Advanced lifters fight for small gains. The longer you train, the more patience the game requires."}
   ]},
  {id:"timeline",title:"How Long Will It Really Take?",read:"4 min",tag:"Expectations",
   intro:"Honest, realistic timelines so you don't quit when it's actually going fine.",
   body:[
     {h:"Muscle is built slowly",p:"A natural lifter can realistically gain roughly 20–25 lb of muscle in the first year of proper training, about half that in year two, and progressively less after. These are good-case numbers that assume consistent training, enough protein and enough sleep. Anyone promising 30 lb of muscle in 12 weeks is selling something."},
     {h:"Getting lean is faster",p:"Losing fat to reveal the muscle you have is much quicker than building muscle — typically a few months. If you already train and just need to lean out, you can look dramatically better in a single 12–16 week cut."},
     {h:"The realistic arc",p:"From untrained: noticeably better in 3–6 months, a genuinely good physique in 1–2 years, and the full polished leading-man look in roughly 2–3 years of consistency. That sounds long, but it's a few years for a body that lasts a lifetime."},
     {h:"Consistency beats intensity",p:"Three solid workouts a week for three years beats six brutal workouts a week for three months. The people who get the look are simply the ones who didn't stop."}
   ]},
  {id:"waist",title:"Protecting the Waist",read:"3 min",tag:"Aesthetics",
   intro:"A tight waist is half the V-taper. Here's how to keep it small while still training your core.",
   body:[
     {h:"Train abs for strength and detail, not width",p:"You want a visible, dense six-pack — built with moves like hanging leg raises, ab wheel rollouts and cable crunches — without making the waist physically wider. The muscles that thicken the waist sideways are the obliques under heavy load."},
     {h:"Go easy on heavy loaded oblique work",p:"Heavy weighted side bends and very heavy rotational loading can thicken the obliques and widen the waist over time. You don't need them. Train the core hard through the front (flexion and anti-extension) and keep heavy side-bending out."},
     {h:"The stomach vacuum",p:"Practicing stomach vacuums trains the deep transverse abdominis — the inner 'corset' that pulls the waist in tighter. It's a classic golden-era trick for a smaller-looking midsection. A few 15–30 second holds daily is enough."},
     {h:"Stay lean",p:"Above all, a small waist is mostly about body fat. The leaner you are, the smaller and sharper the waist looks — no exercise substitutes for that."}
   ]},
  {id:"posture",title:"Posture: The Free Upgrade",read:"3 min",tag:"Aesthetics",
   intro:"You can look noticeably better instantly — before building any muscle — just by standing correctly.",
   body:[
     {h:"Posture changes the whole silhouette",p:"Rounded shoulders and a forward head collapse the chest and hide the V-taper. Standing tall with the shoulders back and down opens the chest, widens the shoulders and lengthens the waist. It's the fastest possible improvement to how your physique reads."},
     {h:"Train the back of the body",p:"Most posture problems come from too much sitting and too much pressing relative to pulling. Plenty of rows, face pulls and rear-delt work pulls the shoulders back where they belong. This program is built with that balance in mind."},
     {h:"Mobilize the right spots",p:"A stiff upper back (thoracic spine) and tight hip flexors and chest force you into a slumped position. The mobility routines in this app target exactly those areas — do them daily."}
   ]},
  {id:"bulkcut",title:"Bulk or Cut First?",read:"3 min",tag:"Nutrition",
   intro:"The single most common beginner question, answered with a simple rule.",
   body:[
     {h:"The simple rule",p:"If you're above ~15% body fat (no real ab definition, soft waist), cut first. Getting lean reveals what you have, makes you healthier and more insulin-sensitive, and gives you a clean base to build from. If you're already lean (~10–12% with visible abs), do a slow lean bulk to add muscle."},
     {h:"Why cut first when soft",p:"Bulking on top of existing fat just adds more fat and makes you look worse before you ever look better. You also build muscle better when you're not already carrying excess fat. Lean out first."},
     {h:"How to lean bulk",p:"When you do build, eat in a small surplus — only about 200–300 calories above maintenance — so you add muscle with minimal fat. Aim to gain ~0.5–1 lb per month, not per week. If the waist starts creeping up, you're gaining too fast."},
     {h:"Cycle it",p:"Long-term, you alternate: build in a small surplus for a few months, then cut for a couple of months to stay lean. Over a few years this 'lean gaining' is how you arrive at a muscular, lean physique."}
   ]},
  {id:"recovery",title:"Sleep & Recovery",read:"3 min",tag:"Recovery",
   intro:"You don't grow in the gym — you grow when you recover. This is where most people leave gains on the table.",
   body:[
     {h:"Sleep is the foundation",p:"Aim for 7–9 hours. Sleep is when the bulk of muscle repair and hormone regulation happens. Chronically under-sleeping blunts muscle growth, increases fat gain and wrecks training performance. It is the most underrated physique tool there is."},
     {h:"Recovery is when muscle is built",p:"Training is the stimulus; the actual building happens in the days after, with enough food and rest. That's why this program uses focused, hard sessions with full recovery between them rather than endless daily grinding."},
     {h:"Manage stress and steps",p:"Chronic stress raises cortisol, which works against your goals. Daily walks (8–10k steps), some sunlight, and managing life stress all support both fat loss and recovery."}
   ]},
  {id:"mediumgym",title:"Training in a Medium Gym",read:"3 min",tag:"Practical",
   intro:"You don't need a fancy gym. Here's how to run the whole program with basic equipment.",
   body:[
     {h:"The essentials",p:"A barbell and plates, a set of dumbbells, an adjustable bench, a pull-up bar and a cable machine cover everything in this program. Almost every commercial and hotel-tier gym has these."},
     {h:"Swap freely",p:"Every exercise in the library lists substitutions. No barbell? Use dumbbells. No cable? Use bands or dumbbells. No dip station? Use a close-grip press. The movement pattern matters more than the exact tool — pick what your gym has and progress it."},
     {h:"Minimum equipment plan",p:"With just dumbbells and a bench you can still build the look: DB shoulder press, incline DB press, DB lateral raises, single-arm DB rows, goblet squats, DB RDLs, and bodyweight core. Don't let equipment be the excuse."}
   ]}
];

/* ============================================================
   MOBILITY
   ============================================================ */
const MOBILITY = {
  daily:{
    name:"Daily 10-Minute Flow",
    blurb:"Do this every morning or before bed. Pliable, mobile joints keep you training pain-free for decades — and make you move like an athlete, not a stiff gym bro.",
    moves:[
      {n:"World's Greatest Stretch",t:"5 / side",d:"Lunge, drop the back knee, drive the same-side elbow to the floor, then rotate the top arm to the ceiling. Opens hips, t-spine and hamstrings at once."},
      {n:"Cat–Cow",t:"10 reps",d:"On all fours, alternate arching and rounding the spine slowly with the breath."},
      {n:"Deep Squat Hold + Pry",t:"60 sec",d:"Sink into a deep bodyweight squat, elbows inside the knees, gently pry the knees out."},
      {n:"Thoracic Rotations",t:"8 / side",d:"On all fours, hand behind the head, rotate the elbow down then open to the ceiling. Unlocks upper-back rotation for posture and pressing."},
      {n:"90/90 Hip Switches",t:"10 reps",d:"Seated, both knees bent 90°, rotate the legs side to side without using the hands."},
      {n:"Couch Stretch",t:"45 sec / side",d:"Rear shin against a wall, kneel tall on the other leg. Opens the hip flexors desk-sitting locks up."},
    ]
  },
  warmup:{
    name:"Pre-Lift Warm-Up",
    blurb:"5 minutes before you touch a heavy bar. Primes the joints and nervous system so your top sets feel strong and safe.",
    moves:[
      {n:"Arm Circles + Band Pull-Aparts",t:"20 each",d:"Wake up the shoulders and rear delts before pressing or pulling."},
      {n:"Scapular Pull-Ups",t:"8 reps",d:"Hang and pull the shoulder blades down without bending the arms."},
      {n:"Bodyweight Squats → Deep Hold",t:"15 reps",d:"Grease the knees and hips before loading."},
      {n:"Hip Airplanes",t:"5 / side",d:"Single-leg hinge with rotation to stabilize the hips and glutes."},
      {n:"Empty-Bar Practice Sets",t:"2 sets",d:"Always rehearse the day's main lift light before the work sets."},
    ]
  },
  cooldown:{
    name:"Post-Lift Stretch",
    blurb:"5 minutes after training, while you're warm — this is when flexibility gains actually stick.",
    moves:[
      {n:"Doorway Chest Stretch",t:"45 sec",d:"Open the chest and front delts after pressing — fixes the rounded look."},
      {n:"Lat Stretch (Hang or Wall)",t:"45 sec",d:"Decompress the spine and lengthen the lats after pulling."},
      {n:"Pigeon Pose",t:"60 sec / side",d:"Deep glute and hip opener after leg day."},
      {n:"Standing Hamstring Stretch",t:"45 sec / side",d:"Lengthen the hamstrings after deadlifts and squats."},
      {n:"Child's Pose + Side Reach",t:"60 sec",d:"Decompress and breathe to drop into recovery."},
    ]
  }
};

return {FIG, EX, ARCHETYPES, PROGRAM, STANDARDS, BODYFAT, LEARN, MOBILITY, REST};
})();
