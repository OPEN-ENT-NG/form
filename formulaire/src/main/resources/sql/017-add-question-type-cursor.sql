INSERT INTO formulaire.question_type(code, name)
VALUES (11, 'CURSOR');

ALTER TABLE formulaire.question
    ADD COLUMN cursor_min_val           bigint,
    ADD COLUMN cursor_max_val           bigint,
    ADD COLUMN cursor_step              bigint,
    ADD COLUMN cursor_label_min_val     VARCHAR,
    ADD COLUMN cursor_label_max_val     VARCHAR;