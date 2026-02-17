import { ICaptcha, ICaptchaDTO } from "./types";

export const transformCaptcha = (raw: ICaptchaDTO): ICaptcha => {
  return {
    captchaId: raw.captcha_id,
    questionType: raw.question_type,
    title: raw.title,
  };
};
