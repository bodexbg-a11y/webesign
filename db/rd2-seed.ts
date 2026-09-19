/**
 * Стартовий набір даних — розстановка РЦ-2 на 07.09.26 з паперового бланка.
 * Завантажується лише вручну (кнопка «Завантажити бланк 07.09.26»), щоб
 * порожню базу можна було одразу побачити в роботі.
 */
export const SEED_DATE = "2026-09-07";

type SeedPerson = { name: string; column?: string; row?: "main" | "trainee"; group?: "shift" | "day"; tag?: string };

export const SEED_ROSTER: Record<string, SeedPerson[]> = {
  NZRC: [
    { name: "Петренко Є.О.", column: "A" },
    { name: "Котляревський С.Ю.", column: "A" },
    { name: "Чорний В.С.", column: "B" },
    { name: "Нохрін С.О.", column: "B" },
    { name: "Іщенко О.П.", column: "V" },
    { name: "Андрєєв Ю.М.", column: "V" },
    { name: "Потовіченко О.В.", column: "G" },
    { name: "Волков А.М.", column: "D" },
    { name: "Загребний В.В.", column: "DAY", group: "day" },
    { name: "Чумак С.В.", column: "DAY", group: "day" },
    { name: "Видаш А.С.", column: "DAY", group: "day" },
    { name: "Залевський М.О.", group: "day" },
    { name: "Ніколаєнко М.Г.", group: "day" },
  ],
  SHUR: [
    { name: "Шишканов А.С.", column: "A" },
    { name: "Кирилюк В.В.", column: "B" },
    { name: "Олійник В.Г.", column: "V" },
    { name: "Селіверстов О.В.", column: "V" },
    { name: "Кичак Є.В.", column: "G" },
    { name: "Пономаренко І.О.", column: "G" },
    { name: "Стахієв І.М.", column: "D" },
    { name: "Білянський В.В.", column: "D" },
    { name: "Фальчиков А.О.", column: "DAY", group: "day" },
    { name: "Шишко Р.А.", column: "DAY", group: "day" },
    { name: "Сьомик О.І.", column: "DAY", group: "day" },
    { name: "Бойчук Ю.І.", column: "D", row: "trainee" },
  ],
  IEU: [
    { name: "Бевз І.Г.", column: "A" },
    { name: "Колесник М.В.", column: "B" },
    { name: "Шулятніков О.М.", column: "V" },
    { name: "Запорожан В.В.", column: "G" },
    { name: "Печенюк А.А.", column: "D" },
    { name: "Бочаров А.А.", column: "DAY", group: "day" },
    { name: "Конопьолкін П.Г.", column: "B", row: "trainee", tag: "(12)" },
    { name: "Константінов В.В." },
    { name: "Горбенко М.С." },
  ],
  SORV: [
    { name: "Сорокін Д.С.", column: "A" },
    { name: "Агапов Р.В.", column: "B" },
    { name: "Коренюк Г.І.", column: "V" },
    { name: "Нетудихатко К.В.", column: "G" },
    { name: "Голубєв І.О.", column: "D" },
    { name: "Вовненко М.А." },
    { name: "Славінський О.Л." },
  ],
  ORV: [
    { name: "Сенедяк Д.М.", column: "A" },
    { name: "Живогляд О.В.", column: "B" },
    { name: "Морозов А.С.", column: "V" },
    { name: "Яворський М.О.", column: "G" },
    { name: "Акульшин Ю.Ю.", column: "D" },
    { name: "Циганков О.О.", column: "V", row: "trainee" },
    { name: "Іващенко В.В.", column: "SICK", row: "trainee" },
    { name: "Литвинов Б.А." },
    { name: "Петров О.С." },
  ],
  MOTU: [
    { name: "Курагін Є.В.", column: "A" },
    { name: "Чепіженко А.О.", column: "B" },
    { name: "Павлишак О.М.", column: "V" },
    { name: "Прокоф'єв С.С.", column: "G" },
    { name: "Міліцин В.А.", column: "D" },
    { name: "Лашкін М.К.", column: "A", row: "trainee", tag: "(21)" },
    { name: "Молєв В.О.", column: "B", row: "trainee", tag: "(18)" },
    { name: "Форостяний В.М." },
  ],
};

export const SEED_ABSENCES: { name: string; kind: "vacation" | "planned" | "sick" | "trip"; start: string; end: string }[] = [
  { name: "Залевський М.О.", kind: "vacation", start: "2026-08-31", end: "2026-09-13" },
  { name: "Ніколаєнко М.Г.", kind: "vacation", start: "2026-09-07", end: "2026-09-18" },
  { name: "Константінов В.В.", kind: "vacation", start: "2026-08-17", end: "2026-09-14" },
  { name: "Горбенко М.С.", kind: "vacation", start: "2026-09-03", end: "2026-09-16" },
  { name: "Вовненко М.А.", kind: "vacation", start: "2026-08-25", end: "2026-09-18" },
  { name: "Славінський О.Л.", kind: "vacation", start: "2026-09-01", end: "2026-09-14" },
  { name: "Литвинов Б.А.", kind: "vacation", start: "2026-08-23", end: "2026-09-11" },
  { name: "Петров О.С.", kind: "vacation", start: "2026-09-03", end: "2026-09-29" },
  { name: "Форостяний В.М.", kind: "vacation", start: "2026-08-26", end: "2026-09-08" },
  { name: "Андрєєв Ю.М.", kind: "planned", start: "2026-09-15", end: "2026-10-01" },
  { name: "Селіверстов О.В.", kind: "planned", start: "2026-09-10", end: "2026-09-24" },
  { name: "Сьомик О.І.", kind: "planned", start: "2026-09-20", end: "2026-10-03" },
  { name: "Бевз І.Г.", kind: "planned", start: "2026-09-25", end: "2026-10-09" },
  { name: "Іващенко В.В.", kind: "sick", start: "2026-09-01", end: "2026-09-30" },
];
