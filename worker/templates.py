"""
SatPrep Parametric Template Engine
Generates mathematically guaranteed, calibrated Quant questions for Indian Bank Exams.
Produces stem (with KaTeX), 5 options (A-E), correct answer, solver code,
step-by-step solution, shortcut trick, and wrong-option rationales.
"""
import random
import uuid
from typing import Dict, Any, List

def generate_quadratic_comparison() -> Dict[str, Any]:
    """Generates an exam-realistic quadratic comparison question (x vs y)"""
    # Pick roots
    r1, r2 = random.randint(2, 12), random.randint(2, 12)
    s1, s2 = random.randint(2, 12), random.randint(2, 12)
    
    # Equation 1: x^2 - (r1+r2)x + r1*r2 = 0 -> roots are +r1, +r2
    b1 = r1 + r2
    c1 = r1 * r2
    
    # Equation 2: y^2 - (s1+s2)y + s1*s2 = 0 -> roots are +s1, +s2
    b2 = s1 + s2
    c2 = s1 * s2
    
    x_roots = sorted([r1, r2])
    y_roots = sorted([s1, s2])
    
    # Determine relationship
    # Options standard in banking:
    # A: x > y
    # B: x < y
    # C: x >= y
    # D: x <= y
    # E: x = y or relationship cannot be established
    min_x, max_x = x_roots[0], x_roots[1]
    min_y, max_y = y_roots[0], y_roots[1]
    
    if min_x > max_y:
        rel = 'a'
        explanation = f"Since both roots of x ({min_x}, {max_x}) are strictly greater than both roots of y ({min_y}, {max_y}), $x > y$."
    elif max_x < min_y:
        rel = 'b'
        explanation = f"Since both roots of x ({min_x}, {max_x}) are strictly less than both roots of y ({min_y}, {max_y}), $x < y$."
    elif min_x >= max_y and (min_x == max_y):
        rel = 'c'
        explanation = f"Comparing roots: $x \\in \\{{{min_x}, {max_x}\\}}$ and $y \\in \\{{{min_y}, {max_y}\\}}$. Here $x \\ge y$."
    elif max_x <= min_y and (max_x == min_y):
        rel = 'd'
        explanation = f"Comparing roots: $x \\in \\{{{min_x}, {max_x}\\}}$ and $y \\in \\{{{min_y}, {max_y}\\}}$. Here $x \\le y$."
    else:
        rel = 'e'
        explanation = f"Roots of x are {min_x}, {max_x} and roots of y are {min_y}, {max_y}. Ranges overlap, so no clear relationship can be established."
        
    stem = f"In the following question, two equations (I) and (II) are given. You have to solve both the equations and establish the relation between $x$ and $y$.\n\n" \
           f"**I.** $x^2 - {b1}x + {c1} = 0$\n\n" \
           f"**II.** $y^2 - {b2}y + {c2} = 0$"
           
    options = [
        {"id": "a", "text": "x > y"},
        {"id": "b", "text": "x < y"},
        {"id": "c", "text": "x ≥ y"},
        {"id": "d", "text": "x ≤ y"},
        {"id": "e", "text": "x = y or relationship cannot be established"}
    ]
    
    solver_code = f"""def solve():
    x_roots = [{r1}, {r2}]
    y_roots = [{s1}, {s2}]
    if min(x_roots) > max(y_roots): return 'x > y'
    if max(x_roots) < min(y_roots): return 'x < y'
    if min(x_roots) >= max(y_roots): return 'x ≥ y'
    if max(x_roots) <= min(y_roots): return 'x ≤ y'
    return 'x = y or relationship cannot be established'
"""

    return {
        "id": str(uuid.uuid4()),
        "topic_id": "quadratic-equations",
        "subtopic_id": "root-comparison",
        "stem": stem,
        "options": options,
        "type": "quadratic",
        "difficulty_assigned": random.choice([2, 3]),
        "source": "template",
        "correct_option": rel,
        "solution": f"**Step 1:** Solve equation I: $x^2 - {b1}x + {c1} = 0$\nFactors of {c1} that add up to {b1} are {r1} and {r2}.\n$\\implies x = {r1}, {r2}$\n\n" \
                    f"**Step 2:** Solve equation II: $y^2 - {b2}y + {c2} = 0$\nFactors of {c2} that add up to {b2} are {s1} and {s2}.\n$\\implies y = {s1}, {s2}$\n\n" \
                    f"**Step 3:** Compare values:\n{explanation}",
        "shortcut": f"Look at the signs: $+ {c1}$ and $+ {c2}$ indicate both sets of roots are positive. Directly compare extreme bounds: x values are in [{min_x}, {max_x}] and y in [{min_y}, {max_y}].",
        "option_rationales": {
            "a": "Chosen if student assumed higher constant term automatically means greater root.",
            "b": "Chosen if student forgot to flip signs when solving $(x - r_1)(x - r_2) = 0$.",
            "c": "Chosen if student compared only one root pair and missed the other.",
            "d": "Chosen if student inverted the variable inequality direction.",
            "e": "Chosen if student detected overlap between values or failed to factorize."
        },
        "solver_code": solver_code
    }

def generate_simplification() -> Dict[str, Any]:
    """Generates an exam-realistic simplification question with BODMAS rules"""
    pct = random.choice([15, 20, 25, 30, 40, 50, 75])
    base = random.choice([120, 160, 240, 320, 400, 480, 600, 800])
    sq_root_val = random.choice([12, 14, 15, 16, 18, 20, 25, 30])
    sq_num = sq_root_val ** 2
    div = random.choice([2, 3, 4, 5, 6])
    mult = sq_root_val * div
    
    # Calculation: (pct % of base) + (sqrt(sq_num) * div) - add_const = Ans
    part1 = int((pct / 100) * base)
    part2 = sq_root_val * div
    sub_val = random.randint(10, 50)
    ans = part1 + part2 - sub_val
    
    stem = f"What value should come in place of the question mark ($?$) in the following question?\n\n" \
           f"${pct}\\% \\text{{ of }} {base} + \\sqrt{{{sq_num}}} \\times {div} - {sub_val} = ?$"
           
    # Generate realistic distractors
    distractors = [
        ans + 10,
        ans - 10,
        part1 + sq_root_val - sub_val, # Forgot multiplication
        ans + sub_val # Added instead of subtracted
    ]
    random.shuffle(distractors)
    
    all_options_vals = [ans] + distractors[:4]
    random.shuffle(all_options_vals)
    
    correct_idx = all_options_vals.index(ans)
    correct_letter = ['a', 'b', 'c', 'd', 'e'][correct_idx]
    
    options = [
        {"id": chr(97 + i), "text": str(val)}
        for i, val in enumerate(all_options_vals)
    ]
    
    solver_code = f"""def solve():
    return {ans}
"""

    return {
        "id": str(uuid.uuid4()),
        "topic_id": "simplification",
        "subtopic_id": "bodmas",
        "stem": stem,
        "options": options,
        "type": "mcq",
        "difficulty_assigned": random.choice([1, 2]),
        "source": "template",
        "correct_option": correct_letter,
        "solution": f"Apply the BODMAS rule strictly:\n" \
                    f"**Step 1:** Calculate the percentage: ${pct}\\% \\text{{ of }} {base} = \\frac{{{pct}}}{{100}} \\times {base} = {part1}$\n" \
                    f"**Step 2:** Evaluate the square root: $\\sqrt{{{sq_num}}} = {sq_root_val}$\n" \
                    f"**Step 3:** Perform multiplication: ${sq_root_val} \\times {div} = {part2}$\n" \
                    f"**Step 4:** Combine: ${part1} + {part2} - {sub_val} = {part1 + part2} - {sub_val} = {ans}$",
        "shortcut": f"Split percentage mentally: ${pct}\\% = 10\\% \\times {pct//10}$ (or fractional equivalent $\\frac{{{pct}}}{{100}}$), then combine.",
        "option_rationales": {
            opt["id"]: f"Distractor {'due to arithmetic error in BODMAS precedence' if opt['id'] != correct_letter else 'Correct value'}"
            for opt in options
        },
        "solver_code": solver_code
    }

def generate_number_series() -> Dict[str, Any]:
    """Generates a missing number series question with common patterns (diff of diff, xN + M)"""
    start = random.randint(4, 15)
    mult = random.choice([2, 3])
    add_const = random.randint(1, 4)
    
    series = [start]
    for _ in range(5):
        nxt = series[-1] * mult + add_const
        series.append(nxt)
        
    # Pick missing position (index 3 or 4)
    missing_idx = random.choice([3, 4])
    ans = series[missing_idx]
    
    display_series = [str(x) if i != missing_idx else "?" for i, x in enumerate(series)]
    stem = f"Find the missing number in the given series:\n\n" \
           f"**{', '.join(display_series)}**"
           
    distractors = [ans + mult, ans - mult, ans + 10, ans - 10]
    all_options_vals = [ans] + distractors
    random.shuffle(all_options_vals)
    correct_letter = ['a', 'b', 'c', 'd', 'e'][all_options_vals.index(ans)]
    
    options = [
        {"id": chr(97 + i), "text": str(val)}
        for i, val in enumerate(all_options_vals)
    ]
    
    solver_code = f"""def solve():
    return {ans}
"""

    return {
        "id": str(uuid.uuid4()),
        "topic_id": "number-series",
        "subtopic_id": "missing-number-series",
        "stem": stem,
        "options": options,
        "type": "mcq",
        "difficulty_assigned": random.choice([2, 3]),
        "source": "template",
        "correct_option": correct_letter,
        "solution": f"The pattern followed in the series is:\n" \
                    f"$T_{{n+1}} = T_n \\times {mult} + {add_const}$\n" \
                    f"Check terms:\n" \
                    f"- ${series[0]} \\times {mult} + {add_const} = {series[1]}$\n" \
                    f"- ${series[1]} \\times {mult} + {add_const} = {series[2]}$\n" \
                    f"Therefore the missing term is: ${series[missing_idx-1]} \\times {mult} + {add_const} = {ans}$",
        "shortcut": f"Notice the ratio between consecutive numbers is approximately ${mult}$. Test the multiplier first.",
        "option_rationales": {
            opt["id"]: f"Distractor {'due to pure addition assumption' if opt['id'] != correct_letter else 'Correct value'}"
            for opt in options
        },
        "solver_code": solver_code
    }

def generate_profit_loss() -> Dict[str, Any]:
    """Generates an arithmetic Profit & Loss / Discount problem"""
    cp = random.choice([400, 500, 600, 800, 1000, 1200, 1500])
    markup_pct = random.choice([20, 25, 30, 40, 50])
    discount_pct = random.choice([10, 15, 20])
    
    mp = int(cp * (1 + markup_pct / 100))
    sp = int(mp * (1 - discount_pct / 100))
    profit = sp - cp
    profit_pct = round((profit / cp) * 100, 2)
    
    stem = f"A merchant marks his goods **{markup_pct}%** above the cost price and allows a discount of **{discount_pct}%** on the marked price. " \
           f"If the cost price of the article is **Rs. {cp}**, find his overall profit percentage."
           
    ans = f"{profit_pct}%"
    distractors = [
        f"{round(markup_pct - discount_pct, 2)}%", # Direct subtraction mistake!
        f"{round(profit_pct + 2, 2)}%",
        f"{round(profit_pct - 2, 2)}%",
        f"{round((discount_pct / markup_pct) * 100, 2)}%"
    ]
    
    all_options_vals = [ans] + distractors
    random.shuffle(all_options_vals)
    correct_letter = ['a', 'b', 'c', 'd', 'e'][all_options_vals.index(ans)]
    
    options = [
        {"id": chr(97 + i), "text": val}
        for i, val in enumerate(all_options_vals)
    ]
    
    solver_code = f"""def solve():
    cp = {cp}
    mp = cp * (1 + {markup_pct}/100)
    sp = mp * (1 - {discount_pct}/100)
    profit_pct = round(((sp - cp)/cp)*100, 2)
    return '{profit_pct}%'
"""

    return {
        "id": str(uuid.uuid4()),
        "topic_id": "profit-and-loss",
        "subtopic_id": "dishonest-dealer",
        "stem": stem,
        "options": options,
        "type": "mcq",
        "difficulty_assigned": random.choice([2, 3]),
        "source": "template",
        "correct_option": correct_letter,
        "solution": f"**Step 1:** Cost Price ($CP$) = Rs. {cp}\n" \
                    f"**Step 2:** Marked Price ($MP$) = ${cp} + {markup_pct}\\% \\text{{ of }} {cp} = {cp} + {int(cp*markup_pct/100)} = \\text{{Rs. }} {mp}$\n" \
                    f"**Step 3:** Selling Price ($SP$) after {discount_pct}% discount on MP:\n" \
                    f"$SP = {mp} - \\frac{{{discount_pct}}}{{100}} \\times {mp} = {mp} - {int(mp*discount_pct/100)} = \\text{{Rs. }} {sp}$\n" \
                    f"**Step 4:** Profit = $SP - CP = {sp} - {cp} = \\text{{Rs. }} {profit}$\n" \
                    f"$\\text{{Profit Percentage}} = \\frac{{{profit}}}{{{cp}}} \\times 100 = {profit_pct}\\%$",
        "shortcut": f"Use net effect formula: $\\text{{Net \\%}} = x - y - \\frac{{xy}}{{100}} = {markup_pct} - {discount_pct} - \\frac{{{markup_pct} \\times {discount_pct}}}{{100}} = {markup_pct - discount_pct} - {round((markup_pct*discount_pct)/100, 2)} = {profit_pct}\\%$. Cost price Rs. {cp} is not even needed!",
        "option_rationales": {
            opt["id"]: "Common mistake: directly subtracted discount from markup percentage without compounding" if opt["text"] == f"{round(markup_pct - discount_pct, 2)}%" else ("Correct answer" if opt["id"] == correct_letter else "Calculation error")
            for opt in options
        },
        "solver_code": solver_code
    }

def get_template_question(topic: str = None) -> Dict[str, Any]:
    """Factory function dispatching to corresponding parametric generator"""
    if topic == "quadratic-equations":
        return generate_quadratic_comparison()
    elif topic == "simplification":
        return generate_simplification()
    elif topic == "number-series":
        return generate_number_series()
    elif topic == "profit-and-loss":
        return generate_profit_loss()
    else:
        generators = [generate_quadratic_comparison, generate_simplification, generate_number_series, generate_profit_loss]
        return random.choice(generators)()
