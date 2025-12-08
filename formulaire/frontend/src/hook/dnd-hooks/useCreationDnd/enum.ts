export enum DndElementType {
  QUESTION_ROOT = "QUESTION_ROOT",
  QUESTION_SECTION = "QUESTION_SECTION",
  SECTION = "SECTION",
  SECTION_TOP = "SECTION_TOP",
  SECTION_BOTTOM = "SECTION_BOTTOM",
}

// S = SECTION
// ST = SECTION_TOP
// SB = SECTION_BOTTOM
// QR = QUESTION_ROOT
// QS = QUESTION_SECTION
export enum DndMove {
  // S->S
  // S->QR
  // QR->QR
  R_TO_R = "ROOT_TO_ROOT",
  // QS->QS
  // QS->ST (question d'une section A dans le top d'une section B)
  // QS->SB (question d'une section A dans le bottom d'une section B)
  QS_TO_QS = "QUESTION_SECTION_TO_QUESTION_SECTION",
  // QR -> QS
  // QR -> ST
  // QR -> SB
  QR_TO_QS = "QUESTION_ROOT_TO_QUESTION_SECTION",
  // QS -> QR
  // QS -> ST (question d'une section A dans le top de la section A)
  // QS -> SB (question d'une section A dans le bottom de la section A)
  QS_TO_QR = "QUESTION_SECTION_TO_QUESTION_ROOT",
}
