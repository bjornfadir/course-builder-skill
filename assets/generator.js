/**
 * TEMPLATE — randomized practice-problem generator for a course.
 *
 * Every generator function returns a question in the exact shape quiz.js
 * already consumes: { prompt, answers: [string], hint?: string }. This is
 * deliberate — generator.js is a factory of fresh questions, not a second
 * grading system.
 *
 * The two rules that matter (see SKILL.md's "Practice generators" section
 * for why):
 *   1. Do all arithmetic/logic with integers or exact string manipulation
 *      — never floating-point division — for anything whose answer must
 *      match a string exactly. A float-rounded generator will eventually
 *      produce an answer its own quiz can't verify against itself.
 *   2. List every acceptable answer form in `answers`, not just the
 *      canonical one. A false rejection of a correct answer is the worst
 *      failure mode this tool has — it directly undermines the confidence
 *      it exists to build.
 *
 * The two example generators below (genAddition, genVocabRecall) are
 * placeholders — replace them with generators for this course's actual
 * subject. Keep the registry/forLesson/forModule/practiceSet shape; that's
 * what lets a module's final quiz interleave across every lesson it covers.
 *
 * Usage:
 *   const skillIds = Generators.forLesson('0001');           // one lesson
 *   const skillIds = Generators.forModule(['0001','0002']);  // whole module
 *   const q = Generators.randomQuestion(skillIds);            // one fresh question
 *   const qs = Generators.practiceSet(skillIds, 10);          // ten fresh, interleaved
 */
const Generators = (() => {
  // ---- helpers ----------------------------------------------------------

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---- EXAMPLE lesson 0001: replace with this course's real generators --

  // Example: exact-integer arithmetic — safe by construction, no floats.
  function genAddition() {
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    return { prompt: `What is ${a} + ${b}?`, answers: [String(a + b)] };
  }

  // Example: recall-from-a-fixed-set, for subjects with a closed vocabulary
  // (terms, vocab, facts) rather than computed answers.
  const VOCAB = [
    { term: 'example-term-one', def: 'example-definition-one' },
    { term: 'example-term-two', def: 'example-definition-two' },
  ];

  function genVocabRecall() {
    const item = VOCAB[randInt(0, VOCAB.length - 1)];
    return {
      prompt: `What term means: "${item.def}"?`,
      answers: [item.term],
    };
  }

  // ---- registry -----------------------------------------------------------
  // Every skill id maps to the lesson it belongs to (for forLesson) and a
  // generate function. Add one entry per generator above.

  const registry = {
    addition: { lessonId: '0001', label: 'Two-digit addition', generate: genAddition },
    vocabRecall: { lessonId: '0001', label: 'Vocabulary recall', generate: genVocabRecall },
  };

  function forLesson(lessonId) {
    return Object.keys(registry).filter((id) => registry[id].lessonId === lessonId);
  }

  function forModule(lessonIds) {
    return Object.keys(registry).filter((id) => lessonIds.includes(registry[id].lessonId));
  }

  function question(skillId) {
    return registry[skillId].generate();
  }

  function randomQuestion(skillIds) {
    const id = skillIds[Math.floor(Math.random() * skillIds.length)];
    return { skillId: id, ...question(id) };
  }

  function practiceSet(skillIds, count) {
    return Array.from({ length: count }, () => randomQuestion(skillIds));
  }

  return { registry, forLesson, forModule, question, randomQuestion, practiceSet };
})();
