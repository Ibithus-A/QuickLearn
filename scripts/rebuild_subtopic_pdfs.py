from __future__ import annotations

import shutil
from pathlib import Path

from pypdf import PdfReader, PdfWriter


ASSETS_DIR = Path("public/assets")


def chapter(subject: str, source: str, assessment: str, assessment_start: int, lessons: list[tuple[str, int]]):
    return {
        "subject": subject,
        "source": source,
        "assessment": assessment,
        "assessment_start": assessment_start,
        "lessons": lessons,
    }


CHAPTER_SPLITS = [
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch01_Algebra_and_Functions.pdf", "Chapter 1 - Algebra and Functions Assessment.pdf", 40, [
        ("1.1 Laws of Indices.pdf", 4), ("1.2 Surds and Rationalising Denominators.pdf", 7), ("1.3 Quadratic Functions.pdf", 10),
        ("1.4 Simultaneous Equations.pdf", 14), ("1.5 Inequalities.pdf", 18), ("1.6 Polynomials and Algebraic Division.pdf", 21),
        ("1.7 Graphs of Functions.pdf", 25), ("1.8 The Modulus Function.pdf", 28), ("1.9 Composite and Inverse Functions.pdf", 31),
        ("1.10 Transformations of Graphs.pdf", 33), ("1.11 Partial Fractions.pdf", 35), ("1.12 Functions in Modelling.pdf", 38),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch02_Proof.pdf", "Chapter 2 - Proof Assessment.pdf", 17, [
        ("2.1 The Structure of Mathematical Proof.pdf", 3), ("2.2 Proof by Deduction.pdf", 4), ("2.3 Proof by Exhaustion.pdf", 8),
        ("2.4 Disproof by Counter Example.pdf", 11), ("2.5 Proof by Contradiction.pdf", 13),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch03_Coordinate_Geometry.pdf", "Chapter 3 - Coordinate Geometry Assessment.pdf", 13, [
        ("3.1 Straight Lines.pdf", 3), ("3.2 Circles.pdf", 5), ("3.3 Parametric Equations.pdf", 8), ("3.4 Parametric Equations in Modelling.pdf", 11),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch04_Sequences_and_Series.pdf", "Chapter 4 - Sequences and Series Assessment.pdf", 17, [
        ("4.1 Arithmetic Sequences and Series.pdf", 3), ("4.2 Geometric Sequences and Series.pdf", 5), ("4.3 Sigma Notation and Recurrence Relations.pdf", 8),
        ("4.4 Binomial Expansion - Positive Integer n.pdf", 10), ("4.5 Binomial Expansion - Rational n.pdf", 12), ("4.6 Sequences and Series in Modelling.pdf", 15),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch05_Trigonometry.pdf", "Chapter 5 - Trigonometry Assessment.pdf", 22, [
        ("5.1 Radians, Arc Length and Sector Area.pdf", 4), ("5.2 Sine Rule, Cosine Rule and Area of a Triangle.pdf", 6),
        ("5.3 Exact Trigonometric Values.pdf", 7), ("5.4 Trigonometric Graphs and Symmetry.pdf", 8), ("5.5 Small Angle Approximations.pdf", 10),
        ("5.6 Reciprocal and Inverse Trigonometric Functions.pdf", 12), ("5.7 Trigonometric Identities.pdf", 14), ("5.8 The R cos Form.pdf", 16),
        ("5.9 Solving Trigonometric Equations.pdf", 18), ("5.10 Trigonometry in Modelling.pdf", 21),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch06_Exponentials_and_Logarithms.pdf", "Chapter 6 - Exponentials and Logarithms Assessment.pdf", 11, [
        ("6.1 Exponential Functions.pdf", 3), ("6.2 Logarithms and Their Laws.pdf", 5), ("6.3 Logarithmic Graphs for Estimating Parameters.pdf", 7),
        ("6.4 Exponential Growth and Decay.pdf", 9),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch07_Differentiation.pdf", "Chapter 7 - Differentiation Assessment.pdf", 13, [
        ("7.1 Differentiation from First Principles.pdf", 3), ("7.2 Standard Derivatives and Basic Rules.pdf", 5),
        ("7.3 Chain Rule, Product Rule and Quotient Rule.pdf", 7), ("7.4 Applications of Differentiation.pdf", 9),
        ("7.5 Implicit and Parametric Differentiation.pdf", 10), ("7.6 Constructing Differential Equations.pdf", 12),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch08_Integration.pdf", "Chapter 8 - Integration Assessment.pdf", 12, [
        ("8.1 Standard Integrals.pdf", 3), ("8.2 Definite Integrals and Areas.pdf", 5), ("8.3 Integration by Substitution.pdf", 7),
        ("8.4 Integration by Parts.pdf", 8), ("8.5 Integration Using Partial Fractions.pdf", 9), ("8.6 Differential Equations.pdf", 10),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch09_Numerical_Methods.pdf", "Chapter 9 - Numerical Methods Assessment.pdf", 8, [
        ("9.1 Locating Roots by Sign Change.pdf", 3), ("9.2 Fixed Point Iteration.pdf", 5), ("9.3 The Newton-Raphson Method.pdf", 6),
        ("9.4 The Trapezium Rule.pdf", 7),
    ]),
    chapter("Pure Mathematics", "source-pdfs/pure/Excelora_Ch10_Vectors.pdf", "Chapter 10 - Vectors Assessment.pdf", 9, [
        ("10.1 Vectors in Two and Three Dimensions.pdf", 3), ("10.2 Position Vectors and Distance.pdf", 5),
        ("10.3 Vector Problems in Pure Mathematics.pdf", 7),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch1_Modelling_In_Mechanics.pdf", "Chapter 1 - Modelling in Mechanics Assessment.pdf", 6, [
        ("1.1 Modelling Assumptions.pdf", 2), ("1.2 Vectors in Mechanics.pdf", 3),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch2_Constant_Acceleration.pdf", "Chapter 2 - Constant Acceleration Assessment.pdf", 12, [
        ("2.1 Velocity-Time Graphs.pdf", 2), ("2.2 The SUVAT Equations.pdf", 6), ("2.3 Vertical Motion Under Gravity.pdf", 9),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch3_Forces_And_Motion.pdf", "Chapter 3 - Forces and Motion Assessment.pdf", 16, [
        ("3.1 Newton's Laws and Force Diagrams.pdf", 2), ("3.2 Connected Particles and Pulleys.pdf", 6), ("3.3 Inclined Planes.pdf", 11),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch4_Variable_Acceleration.pdf", "Chapter 4 - Variable Acceleration Assessment.pdf", 8, [
        ("4.1 Calculus for Variable Acceleration.pdf", 2), ("4.2 Differentiating Position.pdf", 6),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch5_Moments.pdf", "Chapter 5 - Moments Assessment.pdf", 8, [
        ("5.1 Moments and the Principle of Moments.pdf", 2),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch6_Forces_And_Friction.pdf", "Chapter 6 - Forces and Friction Assessment.pdf", 7, [
        ("6.1 Friction on Inclined Planes.pdf", 2),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch7_Projectiles.pdf", "Chapter 7 - Projectiles Assessment.pdf", 6, [
        ("7.1 Projectile Motion.pdf", 2),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch8_Applications_Of_Forces.pdf", "Chapter 8 - Applications of Forces Assessment.pdf", 7, [
        ("8.1 Forces in Two Dimensions.pdf", 2), ("8.2 Vector Kinematics with Forces.pdf", 5),
    ]),
    chapter("Mechanics", "source-pdfs/mechanics/Excelora_Ch9_Further_Kinematics.pdf", "Chapter 9 - Further Kinematics Assessment.pdf", 8, [
        ("9.1 Vector Kinematics.pdf", 2), ("9.2 Constant Acceleration in Vector Form.pdf", 6),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch1_Data_Collection.pdf", "Chapter 1 - Data Collection Assessment.pdf", 21, [
        ("1.1 Populations and Samples.pdf", 2), ("1.2 Sampling Methods.pdf", 6), ("1.3 Types of Data.pdf", 13),
        ("1.4 The Large Data Set.pdf", 16),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch2_Measures_Of_Location_And_Spread.pdf", "Chapter 2 - Measures of Location and Spread Assessment.pdf", 17, [
        ("2.1 Measures of Central Tendency.pdf", 2), ("2.2 Quartiles, Percentiles and Measures of Spread.pdf", 7),
        ("2.3 Variance and Standard Deviation.pdf", 10), ("2.4 Coding.pdf", 13),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch3_Representations_Of_Data.pdf", "Chapter 3 - Representations of Data Assessment.pdf", 16, [
        ("3.1 Outliers.pdf", 2), ("3.2 Box Plots.pdf", 5), ("3.3 Cumulative Frequency Diagrams.pdf", 8),
        ("3.4 Histograms.pdf", 11), ("3.5 Comparing Data Sets.pdf", 14),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch4_Correlation.pdf", "Chapter 4 - Correlation Assessment.pdf", 8, [
        ("4.1 Scatter Diagrams and Correlation.pdf", 2), ("4.2 Regression Lines.pdf", 5),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch5_Probability.pdf", "Chapter 5 - Probability Assessment.pdf", 12, [
        ("5.1 Calculating Probabilities.pdf", 2), ("5.2 Venn Diagrams.pdf", 3), ("5.3 Mutually Exclusive and Independent Events.pdf", 6),
        ("5.4 Tree Diagrams.pdf", 9),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch6_Statistical_Distributions.pdf", "Chapter 6 - Statistical Distributions Assessment.pdf", 7, [
        ("6.1 Discrete Random Variables.pdf", 2), ("6.2 The Binomial Distribution.pdf", 4),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch7_Hypothesis_Testing.pdf", "Chapter 7 - Hypothesis Testing Assessment.pdf", 7, [
        ("7.1 The Language of Hypothesis Testing.pdf", 2), ("7.2 Finding Critical Regions.pdf", 5),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch8_Regression_Correlation_and_Hypothesis_Testing.pdf", "Chapter 8 - Regression, Correlation and Hypothesis Testing Assessment.pdf", 17, [
        ("8.1 Exponential Models.pdf", 3), ("8.2 Measuring Correlation.pdf", 8), ("8.3 Hypothesis Testing for Zero Correlation.pdf", 12),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch9_Conditional_Probability.pdf", "Chapter 9 - Conditional Probability Assessment.pdf", 28, [
        ("9.1 Set Notation.pdf", 3), ("9.2 Conditional Probability.pdf", 6), ("9.3 Conditional Probabilities in Venn Diagrams.pdf", 10),
        ("9.4 Probability Formulae.pdf", 13),
    ]),
    chapter("Statistics", "source-pdfs/statistics/Excelora_Ch10_The_Normal_Distribution.pdf", "Chapter 10 - The Normal Distribution Assessment.pdf", 33, [
        ("10.1 The Normal Distribution.pdf", 3), ("10.2 Finding Probabilities for Normal Distributions.pdf", 7),
        ("10.3 The Inverse Normal Distribution Function.pdf", 12), ("10.4 The Standard Normal Distribution.pdf", 15),
        ("10.5 Finding Mu and Sigma.pdf", 19), ("10.6 Approximating the Binomial Distribution.pdf", 23),
        ("10.7 Hypothesis Testing with the Normal Distribution.pdf", 28),
    ]),
]


def write_split_pdf(source_path: Path, destination_path: Path, start_page: int, end_page: int) -> None:
    reader = PdfReader(str(source_path))
    writer = PdfWriter()

    for page_index in range(start_page - 1, end_page):
        writer.add_page(reader.pages[page_index])

    destination_path.parent.mkdir(parents=True, exist_ok=True)
    with destination_path.open("wb") as output_file:
        writer.write(output_file)


def main() -> None:
    for subject in ["Pure Mathematics", "Mechanics", "Statistics"]:
        subject_dir = ASSETS_DIR / subject
        if subject_dir.exists():
            shutil.rmtree(subject_dir)
        subject_dir.mkdir(parents=True)

    for chapter_config in CHAPTER_SPLITS:
        source_path = ASSETS_DIR / chapter_config["source"]
        lessons = chapter_config["lessons"]
        assessment_filename = chapter_config["assessment"]
        assessment_start = chapter_config["assessment_start"]
        source_page_count = len(PdfReader(str(source_path)).pages)
        subject_dir = ASSETS_DIR / chapter_config["subject"]

        for index, (lesson_filename, start_page) in enumerate(lessons):
            next_start_page = lessons[index + 1][1] if index + 1 < len(lessons) else assessment_start
            write_split_pdf(source_path, subject_dir / lesson_filename, start_page, next_start_page - 1)
            print(f"wrote {chapter_config['subject']}/{lesson_filename}: {start_page}-{next_start_page - 1}")

        write_split_pdf(source_path, subject_dir / assessment_filename, assessment_start, source_page_count)
        print(f"wrote {chapter_config['subject']}/{assessment_filename}: {assessment_start}-{source_page_count}")


if __name__ == "__main__":
    main()
