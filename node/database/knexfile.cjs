const config = require('./config.cjs').database

module.exports = {
  development: { ...config },
  staging: { ...config },
  production: { ...config },
  onUpdateTrigger: ({ table, except_columns = [] }) => {
    let command = `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    `

    command = addExceptionColumns(command, table, except_columns)

    command = command + `
    EXECUTE PROCEDURE on_update_timestamp();
    `

    return command
  }
}

/**
 * Add an exception column so that the updated_at column doesn't update when these columns are updated
 *
 * @param {string} command
 * @param {string} table
 * @param {string|array} except_columns
 * @returns {string}
 */
const addExceptionColumns = (command, table, except_columns) => {
  if (except_columns.length > 0) {
    if (except_columns instanceof Array) {
      for (let i = 0; i < except_columns.length; i++) {
        const column = except_columns[i]

        if (i === 0) {
          command = command + `WHEN (OLD.${column} IS NOT DISTINCT FROM NEW.${column}`
        } else {
          command = `${command} AND OLD.${column} IS NOT DISTINCT FROM NEW.${column}`
        }
      }

      command = `${command})`
    } else {
      command = command + `WHEN (OLD.${except_columns} IS NOT DISTINCT FROM NEW.${except_columns})`
    }
  }

  return command
}
