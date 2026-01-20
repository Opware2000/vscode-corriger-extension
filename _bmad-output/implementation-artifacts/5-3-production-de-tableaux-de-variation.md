# User Story: Production de Tableaux de Variation

## Story Title
As a math teacher, I want the AI to automatically generate variation tables with derivative signs for mathematical functions, so that I can provide clear visual analysis of function behavior in my corrections.

## Acceptance Criteria

### Functional Requirements
- [ ] When a function analysis exercise is detected, the AI should generate a variation table
- [ ] The variation table should include:
  - Function intervals
  - Signs of the derivative (positive/negative/zero)
  - Function behavior (increasing/decreasing)
  - Critical points (maxima/minima)
- [ ] The table should be generated in LaTeX format compatible with standard math packages
- [ ] The AI should handle different types of functions (polynomial, rational, trigonometric)
- [ ] The table should be integrated into the correction between `\begin{correction}` and `\end{correction}` tags

### Technical Requirements
- [ ] Implement AI prompt instructions for variation table generation
- [ ] Ensure the AI understands French mathematical notation for variation tables
- [ ] Handle edge cases (undefined points, asymptotes)
- [ ] Integrate with existing correction generation pipeline

## Technical Notes
- The extension should NOT generate the tables itself - this is the AI's responsibility
- The extension should NOT verify the correctness of the generated tables - this is also the AI's responsibility
- Use structured prompts to guide AI in creating proper variation tables
- Include examples of expected table formats in the prompts