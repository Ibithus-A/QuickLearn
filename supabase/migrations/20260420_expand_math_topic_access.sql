create or replace function public.sanitize_profile_access()
returns trigger
language plpgsql
as $$
declare
  allowed_chapters text[] := array[
    'Chapter 1: Algebra and Functions',
    'Chapter 2: Proof',
    'Chapter 3: Coordinate Geometry',
    'Chapter 4: Sequences and Series',
    'Chapter 5: Trigonometry',
    'Chapter 6: Exponentials and Logarithms',
    'Chapter 7: Differentiation',
    'Chapter 8: Integration',
    'Chapter 9: Numerical Methods',
    'Chapter 10: Vectors',
    'Chapter 1: Modelling in Mechanics',
    'Chapter 2: Constant Acceleration',
    'Chapter 3: Forces and Motion',
    'Chapter 4: Variable Acceleration',
    'Chapter 5: Moments',
    'Chapter 6: Forces and Friction',
    'Chapter 7: Projectiles',
    'Chapter 8: Applications of Forces',
    'Chapter 9: Further Kinematics',
    'Chapter 1: Data Collection',
    'Chapter 2: Measures of Location and Spread',
    'Chapter 3: Representations of Data',
    'Chapter 4: Correlation',
    'Chapter 5: Probability',
    'Chapter 6: Statistical Distributions',
    'Chapter 7: Hypothesis Testing',
    'Chapter 8: Regression, Correlation and Hypothesis Testing',
    'Chapter 9: Conditional Probability',
    'Chapter 10: The Normal Distribution'
  ];
  chapter_one constant text := 'Chapter 1: Algebra and Functions';
  sanitized_tagged_chapter text;
begin
  new.email = lower(trim(new.email));
  new.full_name = trim(new.full_name);

  if new.tagged_chapter = any (allowed_chapters) then
    sanitized_tagged_chapter := new.tagged_chapter;
  else
    sanitized_tagged_chapter := null;
  end if;

  if new.role = 'student' and new.plan = 'basic' then
    sanitized_tagged_chapter := chapter_one;
  end if;

  new.tagged_chapter = sanitized_tagged_chapter;
  new.unlocked_chapters = (
    select coalesce(
      array_agg(chapter order by chapter_order),
      array[]::text[]
    )
    from (
      select distinct
        chapter,
        array_position(allowed_chapters, chapter) as chapter_order
      from unnest(coalesce(new.unlocked_chapters, array[]::text[])) as chapter
      where chapter = any (allowed_chapters)
        and chapter <> chapter_one
    ) sanitized_chapters
  );

  return new;
end;
$$;

update public.profiles
set unlocked_chapters = unlocked_chapters,
    tagged_chapter = tagged_chapter;
