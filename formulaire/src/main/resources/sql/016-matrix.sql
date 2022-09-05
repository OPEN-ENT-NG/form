INSERT INTO formulaire.question_type(code, name) VALUES (10, 'MATRIX');

ALTER TABLE formulaire.question
    ADD COLUMN matrix_id    bigint,
    ADD CONSTRAINT fk_matrix_id FOREIGN KEY (matrix_id) REFERENCES formulaire.question (id) ON UPDATE NO ACTION ON DELETE CASCADE;