CREATE TABLE formulaire.section (
    id                      bigserial PRIMARY KEY,
    form_id                 bigint NOT NULL,
    title                   VARCHAR NOT NULL,
    description             VARCHAR,
    position                bigint NOT NULL,
    original_section_id     bigint,
    CONSTRAINT fk_form_id FOREIGN KEY (form_id) REFERENCES formulaire.form(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE formulaire.question
    ALTER COLUMN position           DROP NOT NULL,
    ADD COLUMN section_id           bigint,
    ADD COLUMN section_position     bigint,
    ADD COLUMN conditional          boolean NOT NULL DEFAULT FALSE,
    ADD CONSTRAINT fk_section_id FOREIGN KEY (section_id) REFERENCES formulaire.section(id) ON UPDATE NO ACTION ON DELETE CASCADE;


ALTER TABLE formulaire.question_choice
    ADD COLUMN next_section_id bigint,
    ADD CONSTRAINT fk_next_section_id FOREIGN KEY (next_section_id) REFERENCES formulaire.section(id) ON UPDATE NO ACTION ON DELETE SET NULL;