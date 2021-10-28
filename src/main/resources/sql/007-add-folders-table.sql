CREATE TABLE formulaire.folder (
    id                  bigserial PRIMARY KEY,
    parent_id           bigint DEFAULT 0,
    name                VARCHAR NOT NULL,
    user_id             VARCHAR(36) NOT NULL,
    nb_folder_children  bigint DEFAULT 0,
    nb_form_children    bigint DEFAULT 0,
    CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES formulaire.folder(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE formulaire.rel_form_folder (
   user_id      VARCHAR(36) NOT NULL,
   form_id      bigint NOT NULL,
   folder_id    bigint NOT NULL,
   CONSTRAINT fk_form_id FOREIGN KEY (form_id) REFERENCES formulaire.form(id) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT fk_folder_id FOREIGN KEY (folder_id) REFERENCES formulaire.folder(id) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT unique_rel_form_folder UNIQUE (user_id, form_id, folder_id)
);

INSERT INTO formulaire.folder (id, parent_id, name, user_id, nb_folder_children, nb_form_children) VALUES
(0, null, 'Mes formulaires', '', null, null),
(1, null, 'Partagés avec moi', '', null, null),
(2, null, 'Corbeille', '', null, null);

WITH forms AS (SELECT id, owner_id FROM formulaire.form GROUP BY id, owner_id)
INSERT INTO formulaire.rel_form_folder (user_id, form_id, folder_id) SELECT owner_id, id, 0 FROM forms;