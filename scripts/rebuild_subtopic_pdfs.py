from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader, PdfWriter


ASSETS_DIR = Path("public/assets")


CHAPTER_SPLITS = [
    {
        "source": "Excelora_Ch01_Algebra_and_Functions.pdf",
        "assessment": "Chapter 1 Assessment.pdf",
        "assessment_start": 40,
        "lessons": [
            ("1.1 Laws of Indices.pdf", 4),
            ("1.2 Surds and Rationalising Denominators.pdf", 7),
            ("1.3 Quadratic Functions.pdf", 10),
            ("1.4 Simultaneous Equations.pdf", 14),
            ("1.5 Inequalities.pdf", 18),
            ("1.6 Polynomials and Algebraic Division.pdf", 21),
            ("1.7 Graphs of Functions.pdf", 25),
            ("1.8 The Modulus Function.pdf", 28),
            ("1.9 Composite and Inverse Functions.pdf", 31),
            ("1.10 Transformations of Graphs.pdf", 33),
            ("1.11 Partial Fractions.pdf", 35),
            ("1.12 Functions in Modelling.pdf", 38),
        ],
    },
    {
        "source": "Excelora_Ch02_Proof.pdf",
        "assessment": "Chapter 2 Assessment.pdf",
        "assessment_start": 17,
        "lessons": [
            ("2.1 The Structure of Mathematical Proof.pdf", 3),
            ("2.2 Proof by Deduction.pdf", 4),
            ("2.3 Proof by Exhaustion.pdf", 8),
            ("2.4 Disproof by Counter Example.pdf", 11),
            ("2.5 Proof by Contradiction.pdf", 13),
        ],
    },
    {
        "source": "Excelora_Ch03_Coordinate_Geometry.pdf",
        "assessment": "Chapter 3 Assessment.pdf",
        "assessment_start": 13,
        "lessons": [
            ("3.1 Straight Lines.pdf", 3),
            ("3.2 Circles.pdf", 5),
            ("3.3 Parametric Equations.pdf", 8),
            ("3.4 Parametric Equations in Modelling.pdf", 11),
        ],
    },
    {
        "source": "Excelora_Ch04_Sequences_and_Series.pdf",
        "assessment": "Chapter 4 Assessment.pdf",
        "assessment_start": 17,
        "lessons": [
            ("4.1 Arithmetic Sequences and Series.pdf", 3),
            ("4.2 Geometric Sequences and Series.pdf", 5),
            ("4.3 Sigma Notation and Recurrence Relations.pdf", 8),
            ("4.4 Binomial Expansion - Positive Integer n.pdf", 10),
            ("4.5 Binomial Expansion - Rational n.pdf", 12),
            ("4.6 Sequences and Series in Modelling.pdf", 15),
        ],
    },
    {
        "source": "Excelora_Ch05_Trigonometry.pdf",
        "assessment": "Chapter 5 Assessment.pdf",
        "assessment_start": 22,
        "lessons": [
            ("5.1 Radians, Arc Length and Sector Area.pdf", 4),
            ("5.2 Sine Rule, Cosine Rule and Area of a Triangle.pdf", 6),
            ("5.3 Exact Trigonometric Values.pdf", 7),
            ("5.4 Trigonometric Graphs and Symmetry.pdf", 8),
            ("5.5 Small Angle Approximations.pdf", 10),
            ("5.6 Reciprocal and Inverse Trigonometric Functions.pdf", 12),
            ("5.7 Trigonometric Identities.pdf", 14),
            ("5.8 The R cos Form.pdf", 16),
            ("5.9 Solving Trigonometric Equations.pdf", 18),
            ("5.10 Trigonometry in Modelling.pdf", 21),
        ],
    },
    {
        "source": "Excelora_Ch06_Exponentials_and_Logarithms.pdf",
        "assessment": "Chapter 6 Assessment.pdf",
        "assessment_start": 11,
        "lessons": [
            ("6.1 Exponential Functions.pdf", 3),
            ("6.2 Logarithms and Their Laws.pdf", 5),
            ("6.3 Logarithmic Graphs for Estimating Parameters.pdf", 7),
            ("6.4 Exponential Growth and Decay.pdf", 9),
        ],
    },
    {
        "source": "Excelora_Ch07_Differentiation.pdf",
        "assessment": "Chapter 7 Assessment.pdf",
        "assessment_start": 13,
        "lessons": [
            ("7.1 Differentiation from First Principles.pdf", 3),
            ("7.2 Standard Derivatives and Basic Rules.pdf", 5),
            ("7.3 Chain Rule, Product Rule and Quotient Rule.pdf", 7),
            ("7.4 Applications of Differentiation.pdf", 9),
            ("7.5 Implicit and Parametric Differentiation.pdf", 10),
            ("7.6 Constructing Differential Equations.pdf", 12),
        ],
    },
    {
        "source": "Excelora_Ch08_Integration.pdf",
        "assessment": "Chapter 8 Assessment.pdf",
        "assessment_start": 12,
        "lessons": [
            ("8.1 Standard Integrals.pdf", 3),
            ("8.2 Definite Integrals and Areas.pdf", 5),
            ("8.3 Integration by Substitution.pdf", 7),
            ("8.4 Integration by Parts.pdf", 8),
            ("8.5 Integration Using Partial Fractions.pdf", 9),
            ("8.6 Differential Equations.pdf", 10),
        ],
    },
    {
        "source": "Excelora_Ch09_Numerical_Methods.pdf",
        "assessment": "Chapter 9 Assessment.pdf",
        "assessment_start": 8,
        "lessons": [
            ("9.1 Locating Roots by Sign Change.pdf", 3),
            ("9.2 Fixed Point Iteration.pdf", 5),
            ("9.3 The Newton-Raphson Method.pdf", 6),
            ("9.4 The Trapezium Rule.pdf", 7),
        ],
    },
    {
        "source": "Excelora_Ch10_Vectors.pdf",
        "assessment": "Chapter 10 Assessment.pdf",
        "assessment_start": 9,
        "lessons": [
            ("10.1 Vectors in Two and Three Dimensions.pdf", 3),
            ("10.2 Position Vectors and Distance.pdf", 5),
            ("10.3 Vector Problems in Pure Mathematics.pdf", 7),
        ],
    },
]


def write_split_pdf(source_path: Path, destination_path: Path, start_page: int, end_page: int) -> None:
    reader = PdfReader(str(source_path))
    writer = PdfWriter()

    for page_index in range(start_page - 1, end_page):
        writer.add_page(reader.pages[page_index])

    with destination_path.open("wb") as output_file:
        writer.write(output_file)


def main() -> None:
    for chapter in CHAPTER_SPLITS:
        source_path = ASSETS_DIR / chapter["source"]
        lessons = chapter["lessons"]
        assessment_filename = chapter["assessment"]
        assessment_start = chapter["assessment_start"]
        source_page_count = len(PdfReader(str(source_path)).pages)

        for index, (lesson_filename, start_page) in enumerate(lessons):
            next_start_page = (
                lessons[index + 1][1]
                if index + 1 < len(lessons)
                else assessment_start
            )
            end_page = next_start_page - 1
            write_split_pdf(
                source_path,
                ASSETS_DIR / lesson_filename,
                start_page,
                end_page,
            )
            print(f"wrote {lesson_filename}: {start_page}-{end_page}")

        write_split_pdf(
            source_path,
            ASSETS_DIR / assessment_filename,
            assessment_start,
            source_page_count,
        )
        print(f"wrote {assessment_filename}: {assessment_start}-{source_page_count}")


if __name__ == "__main__":
    main()
