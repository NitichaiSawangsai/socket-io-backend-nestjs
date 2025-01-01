import * as perfectExpressSanitizer from 'perfect-express-sanitizer';

export const stringSanitizer = (input) => {
  if (!input) {
    return null;
  }

  const options = {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
    sqlLevel: 5,
    noSqlLevel: 5,
  };
  const sanitizedInput = perfectExpressSanitizer.sanitize.prepareSanitize(
    decodeURI(input),
    options,
  );

  return sanitizedInput;
};
