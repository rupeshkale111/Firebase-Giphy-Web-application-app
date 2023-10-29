/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/dotenv";
exports.ids = ["vendor-chunks/dotenv"];
exports.modules = {

/***/ "(ssr)/./node_modules/dotenv/lib/main.js":
/*!*****************************************!*\
  !*** ./node_modules/dotenv/lib/main.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fs = __webpack_require__(/*! fs */ \"fs\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst os = __webpack_require__(/*! os */ \"os\")\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\nconst packageJson = __webpack_require__(/*! ../package.json */ \"(ssr)/./node_modules/dotenv/package.json\")\n\nconst version = packageJson.version\n\nconst LINE = /(?:^|^)\\s*(?:export\\s+)?([\\w.-]+)(?:\\s*=\\s*?|:\\s+?)(\\s*'(?:\\\\'|[^'])*'|\\s*\"(?:\\\\\"|[^\"])*\"|\\s*`(?:\\\\`|[^`])*`|[^#\\r\\n]+)?\\s*(?:#.*)?(?:$|$)/mg\n\n// Parse src into an Object\nfunction parse (src) {\n  const obj = {}\n\n  // Convert buffer to string\n  let lines = src.toString()\n\n  // Convert line breaks to same format\n  lines = lines.replace(/\\r\\n?/mg, '\\n')\n\n  let match\n  while ((match = LINE.exec(lines)) != null) {\n    const key = match[1]\n\n    // Default undefined or null to empty string\n    let value = (match[2] || '')\n\n    // Remove whitespace\n    value = value.trim()\n\n    // Check if double quoted\n    const maybeQuote = value[0]\n\n    // Remove surrounding quotes\n    value = value.replace(/^(['\"`])([\\s\\S]*)\\1$/mg, '$2')\n\n    // Expand newlines if double quoted\n    if (maybeQuote === '\"') {\n      value = value.replace(/\\\\n/g, '\\n')\n      value = value.replace(/\\\\r/g, '\\r')\n    }\n\n    // Add to object\n    obj[key] = value\n  }\n\n  return obj\n}\n\nfunction _parseVault (options) {\n  const vaultPath = _vaultPath(options)\n\n  // Parse .env.vault\n  const result = DotenvModule.configDotenv({ path: vaultPath })\n  if (!result.parsed) {\n    throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`)\n  }\n\n  // handle scenario for comma separated keys - for use with key rotation\n  // example: DOTENV_KEY=\"dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenv.org/vault/.env.vault?environment=prod\"\n  const keys = _dotenvKey(options).split(',')\n  const length = keys.length\n\n  let decrypted\n  for (let i = 0; i < length; i++) {\n    try {\n      // Get full key\n      const key = keys[i].trim()\n\n      // Get instructions for decrypt\n      const attrs = _instructions(result, key)\n\n      // Decrypt\n      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key)\n\n      break\n    } catch (error) {\n      // last key\n      if (i + 1 >= length) {\n        throw error\n      }\n      // try next key\n    }\n  }\n\n  // Parse decrypted .env string\n  return DotenvModule.parse(decrypted)\n}\n\nfunction _log (message) {\n  console.log(`[dotenv@${version}][INFO] ${message}`)\n}\n\nfunction _warn (message) {\n  console.log(`[dotenv@${version}][WARN] ${message}`)\n}\n\nfunction _debug (message) {\n  console.log(`[dotenv@${version}][DEBUG] ${message}`)\n}\n\nfunction _dotenvKey (options) {\n  // prioritize developer directly setting options.DOTENV_KEY\n  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {\n    return options.DOTENV_KEY\n  }\n\n  // secondary infra already contains a DOTENV_KEY environment variable\n  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {\n    return process.env.DOTENV_KEY\n  }\n\n  // fallback to empty string\n  return ''\n}\n\nfunction _instructions (result, dotenvKey) {\n  // Parse DOTENV_KEY. Format is a URI\n  let uri\n  try {\n    uri = new URL(dotenvKey)\n  } catch (error) {\n    if (error.code === 'ERR_INVALID_URL') {\n      throw new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development')\n    }\n\n    throw error\n  }\n\n  // Get decrypt key\n  const key = uri.password\n  if (!key) {\n    throw new Error('INVALID_DOTENV_KEY: Missing key part')\n  }\n\n  // Get environment\n  const environment = uri.searchParams.get('environment')\n  if (!environment) {\n    throw new Error('INVALID_DOTENV_KEY: Missing environment part')\n  }\n\n  // Get ciphertext payload\n  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`\n  const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION\n  if (!ciphertext) {\n    throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`)\n  }\n\n  return { ciphertext, key }\n}\n\nfunction _vaultPath (options) {\n  let dotenvPath = path.resolve(process.cwd(), '.env')\n\n  if (options && options.path && options.path.length > 0) {\n    dotenvPath = options.path\n  }\n\n  // Locate .env.vault\n  return dotenvPath.endsWith('.vault') ? dotenvPath : `${dotenvPath}.vault`\n}\n\nfunction _resolveHome (envPath) {\n  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath\n}\n\nfunction _configVault (options) {\n  _log('Loading env from encrypted .env.vault')\n\n  const parsed = DotenvModule._parseVault(options)\n\n  let processEnv = process.env\n  if (options && options.processEnv != null) {\n    processEnv = options.processEnv\n  }\n\n  DotenvModule.populate(processEnv, parsed, options)\n\n  return { parsed }\n}\n\nfunction configDotenv (options) {\n  let dotenvPath = path.resolve(process.cwd(), '.env')\n  let encoding = 'utf8'\n  const debug = Boolean(options && options.debug)\n\n  if (options) {\n    if (options.path != null) {\n      dotenvPath = _resolveHome(options.path)\n    }\n    if (options.encoding != null) {\n      encoding = options.encoding\n    }\n  }\n\n  try {\n    // Specifying an encoding returns a string instead of a buffer\n    const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }))\n\n    let processEnv = process.env\n    if (options && options.processEnv != null) {\n      processEnv = options.processEnv\n    }\n\n    DotenvModule.populate(processEnv, parsed, options)\n\n    return { parsed }\n  } catch (e) {\n    if (debug) {\n      _debug(`Failed to load ${dotenvPath} ${e.message}`)\n    }\n\n    return { error: e }\n  }\n}\n\n// Populates process.env from .env file\nfunction config (options) {\n  const vaultPath = _vaultPath(options)\n\n  // fallback to original dotenv if DOTENV_KEY is not set\n  if (_dotenvKey(options).length === 0) {\n    return DotenvModule.configDotenv(options)\n  }\n\n  // dotenvKey exists but .env.vault file does not exist\n  if (!fs.existsSync(vaultPath)) {\n    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`)\n\n    return DotenvModule.configDotenv(options)\n  }\n\n  return DotenvModule._configVault(options)\n}\n\nfunction decrypt (encrypted, keyStr) {\n  const key = Buffer.from(keyStr.slice(-64), 'hex')\n  let ciphertext = Buffer.from(encrypted, 'base64')\n\n  const nonce = ciphertext.slice(0, 12)\n  const authTag = ciphertext.slice(-16)\n  ciphertext = ciphertext.slice(12, -16)\n\n  try {\n    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)\n    aesgcm.setAuthTag(authTag)\n    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`\n  } catch (error) {\n    const isRange = error instanceof RangeError\n    const invalidKeyLength = error.message === 'Invalid key length'\n    const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data'\n\n    if (isRange || invalidKeyLength) {\n      const msg = 'INVALID_DOTENV_KEY: It must be 64 characters long (or more)'\n      throw new Error(msg)\n    } else if (decryptionFailed) {\n      const msg = 'DECRYPTION_FAILED: Please check your DOTENV_KEY'\n      throw new Error(msg)\n    } else {\n      console.error('Error: ', error.code)\n      console.error('Error: ', error.message)\n      throw error\n    }\n  }\n}\n\n// Populate process.env with parsed values\nfunction populate (processEnv, parsed, options = {}) {\n  const debug = Boolean(options && options.debug)\n  const override = Boolean(options && options.override)\n\n  if (typeof parsed !== 'object') {\n    throw new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate')\n  }\n\n  // Set process.env\n  for (const key of Object.keys(parsed)) {\n    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {\n      if (override === true) {\n        processEnv[key] = parsed[key]\n      }\n\n      if (debug) {\n        if (override === true) {\n          _debug(`\"${key}\" is already defined and WAS overwritten`)\n        } else {\n          _debug(`\"${key}\" is already defined and was NOT overwritten`)\n        }\n      }\n    } else {\n      processEnv[key] = parsed[key]\n    }\n  }\n}\n\nconst DotenvModule = {\n  configDotenv,\n  _configVault,\n  _parseVault,\n  config,\n  decrypt,\n  parse,\n  populate\n}\n\nmodule.exports.configDotenv = DotenvModule.configDotenv\nmodule.exports._configVault = DotenvModule._configVault\nmodule.exports._parseVault = DotenvModule._parseVault\nmodule.exports.config = DotenvModule.config\nmodule.exports.decrypt = DotenvModule.decrypt\nmodule.exports.parse = DotenvModule.parse\nmodule.exports.populate = DotenvModule.populate\n\nmodule.exports = DotenvModule\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZG90ZW52L2xpYi9tYWluLmpzIiwibWFwcGluZ3MiOiJBQUFBLFdBQVcsbUJBQU8sQ0FBQyxjQUFJO0FBQ3ZCLGFBQWEsbUJBQU8sQ0FBQyxrQkFBTTtBQUMzQixXQUFXLG1CQUFPLENBQUMsY0FBSTtBQUN2QixlQUFlLG1CQUFPLENBQUMsc0JBQVE7QUFDL0Isb0JBQW9CLG1CQUFPLENBQUMsaUVBQWlCOztBQUU3Qzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxpQkFBaUI7QUFDOUQ7QUFDQSxrREFBa0QsV0FBVztBQUM3RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCLFFBQVEsVUFBVSxRQUFRO0FBQ25EOztBQUVBO0FBQ0EseUJBQXlCLFFBQVEsVUFBVSxRQUFRO0FBQ25EOztBQUVBO0FBQ0EseUJBQXlCLFFBQVEsV0FBVyxRQUFRO0FBQ3BEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUNBQXlDLDBCQUEwQjtBQUNuRTtBQUNBO0FBQ0EsK0VBQStFLGdCQUFnQjtBQUMvRjs7QUFFQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5REFBeUQsV0FBVztBQUNwRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0VBQW9FLFVBQVU7O0FBRTlFO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGFBQWE7QUFDYixJQUFJO0FBQ0o7QUFDQSwrQkFBK0IsWUFBWSxFQUFFLFVBQVU7QUFDdkQ7O0FBRUEsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5RUFBeUUsVUFBVTs7QUFFbkY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYywwQkFBMEIsRUFBRSxlQUFlO0FBQ3pELElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLElBQUk7QUFDekIsVUFBVTtBQUNWLHFCQUFxQixJQUFJO0FBQ3pCO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsMEJBQTBCO0FBQzFCLHFCQUFxQjtBQUNyQixzQkFBc0I7QUFDdEIsb0JBQW9CO0FBQ3BCLHVCQUF1Qjs7QUFFdkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1hcHAvLi9ub2RlX21vZHVsZXMvZG90ZW52L2xpYi9tYWluLmpzP2IzYjIiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5jb25zdCBwYWNrYWdlSnNvbiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpXG5cbmNvbnN0IHZlcnNpb24gPSBwYWNrYWdlSnNvbi52ZXJzaW9uXG5cbmNvbnN0IExJTkUgPSAvKD86XnxeKVxccyooPzpleHBvcnRcXHMrKT8oW1xcdy4tXSspKD86XFxzKj1cXHMqP3w6XFxzKz8pKFxccyonKD86XFxcXCd8W14nXSkqJ3xcXHMqXCIoPzpcXFxcXCJ8W15cIl0pKlwifFxccypgKD86XFxcXGB8W15gXSkqYHxbXiNcXHJcXG5dKyk/XFxzKig/OiMuKik/KD86JHwkKS9tZ1xuXG4vLyBQYXJzZSBzcmMgaW50byBhbiBPYmplY3RcbmZ1bmN0aW9uIHBhcnNlIChzcmMpIHtcbiAgY29uc3Qgb2JqID0ge31cblxuICAvLyBDb252ZXJ0IGJ1ZmZlciB0byBzdHJpbmdcbiAgbGV0IGxpbmVzID0gc3JjLnRvU3RyaW5nKClcblxuICAvLyBDb252ZXJ0IGxpbmUgYnJlYWtzIHRvIHNhbWUgZm9ybWF0XG4gIGxpbmVzID0gbGluZXMucmVwbGFjZSgvXFxyXFxuPy9tZywgJ1xcbicpXG5cbiAgbGV0IG1hdGNoXG4gIHdoaWxlICgobWF0Y2ggPSBMSU5FLmV4ZWMobGluZXMpKSAhPSBudWxsKSB7XG4gICAgY29uc3Qga2V5ID0gbWF0Y2hbMV1cblxuICAgIC8vIERlZmF1bHQgdW5kZWZpbmVkIG9yIG51bGwgdG8gZW1wdHkgc3RyaW5nXG4gICAgbGV0IHZhbHVlID0gKG1hdGNoWzJdIHx8ICcnKVxuXG4gICAgLy8gUmVtb3ZlIHdoaXRlc3BhY2VcbiAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKVxuXG4gICAgLy8gQ2hlY2sgaWYgZG91YmxlIHF1b3RlZFxuICAgIGNvbnN0IG1heWJlUXVvdGUgPSB2YWx1ZVswXVxuXG4gICAgLy8gUmVtb3ZlIHN1cnJvdW5kaW5nIHF1b3Rlc1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXihbJ1wiYF0pKFtcXHNcXFNdKilcXDEkL21nLCAnJDInKVxuXG4gICAgLy8gRXhwYW5kIG5ld2xpbmVzIGlmIGRvdWJsZSBxdW90ZWRcbiAgICBpZiAobWF5YmVRdW90ZSA9PT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXFxcbi9nLCAnXFxuJylcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxcXHIvZywgJ1xccicpXG4gICAgfVxuXG4gICAgLy8gQWRkIHRvIG9iamVjdFxuICAgIG9ialtrZXldID0gdmFsdWVcbiAgfVxuXG4gIHJldHVybiBvYmpcbn1cblxuZnVuY3Rpb24gX3BhcnNlVmF1bHQgKG9wdGlvbnMpIHtcbiAgY29uc3QgdmF1bHRQYXRoID0gX3ZhdWx0UGF0aChvcHRpb25zKVxuXG4gIC8vIFBhcnNlIC5lbnYudmF1bHRcbiAgY29uc3QgcmVzdWx0ID0gRG90ZW52TW9kdWxlLmNvbmZpZ0RvdGVudih7IHBhdGg6IHZhdWx0UGF0aCB9KVxuICBpZiAoIXJlc3VsdC5wYXJzZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1JU1NJTkdfREFUQTogQ2Fubm90IHBhcnNlICR7dmF1bHRQYXRofSBmb3IgYW4gdW5rbm93biByZWFzb25gKVxuICB9XG5cbiAgLy8gaGFuZGxlIHNjZW5hcmlvIGZvciBjb21tYSBzZXBhcmF0ZWQga2V5cyAtIGZvciB1c2Ugd2l0aCBrZXkgcm90YXRpb25cbiAgLy8gZXhhbXBsZTogRE9URU5WX0tFWT1cImRvdGVudjovLzprZXlfMTIzNEBkb3RlbnYub3JnL3ZhdWx0Ly5lbnYudmF1bHQ/ZW52aXJvbm1lbnQ9cHJvZCxkb3RlbnY6Ly86a2V5Xzc4OTBAZG90ZW52Lm9yZy92YXVsdC8uZW52LnZhdWx0P2Vudmlyb25tZW50PXByb2RcIlxuICBjb25zdCBrZXlzID0gX2RvdGVudktleShvcHRpb25zKS5zcGxpdCgnLCcpXG4gIGNvbnN0IGxlbmd0aCA9IGtleXMubGVuZ3RoXG5cbiAgbGV0IGRlY3J5cHRlZFxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEdldCBmdWxsIGtleVxuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXS50cmltKClcblxuICAgICAgLy8gR2V0IGluc3RydWN0aW9ucyBmb3IgZGVjcnlwdFxuICAgICAgY29uc3QgYXR0cnMgPSBfaW5zdHJ1Y3Rpb25zKHJlc3VsdCwga2V5KVxuXG4gICAgICAvLyBEZWNyeXB0XG4gICAgICBkZWNyeXB0ZWQgPSBEb3RlbnZNb2R1bGUuZGVjcnlwdChhdHRycy5jaXBoZXJ0ZXh0LCBhdHRycy5rZXkpXG5cbiAgICAgIGJyZWFrXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIGxhc3Qga2V5XG4gICAgICBpZiAoaSArIDEgPj0gbGVuZ3RoKSB7XG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgICAvLyB0cnkgbmV4dCBrZXlcbiAgICB9XG4gIH1cblxuICAvLyBQYXJzZSBkZWNyeXB0ZWQgLmVudiBzdHJpbmdcbiAgcmV0dXJuIERvdGVudk1vZHVsZS5wYXJzZShkZWNyeXB0ZWQpXG59XG5cbmZ1bmN0aW9uIF9sb2cgKG1lc3NhZ2UpIHtcbiAgY29uc29sZS5sb2coYFtkb3RlbnZAJHt2ZXJzaW9ufV1bSU5GT10gJHttZXNzYWdlfWApXG59XG5cbmZ1bmN0aW9uIF93YXJuIChtZXNzYWdlKSB7XG4gIGNvbnNvbGUubG9nKGBbZG90ZW52QCR7dmVyc2lvbn1dW1dBUk5dICR7bWVzc2FnZX1gKVxufVxuXG5mdW5jdGlvbiBfZGVidWcgKG1lc3NhZ2UpIHtcbiAgY29uc29sZS5sb2coYFtkb3RlbnZAJHt2ZXJzaW9ufV1bREVCVUddICR7bWVzc2FnZX1gKVxufVxuXG5mdW5jdGlvbiBfZG90ZW52S2V5IChvcHRpb25zKSB7XG4gIC8vIHByaW9yaXRpemUgZGV2ZWxvcGVyIGRpcmVjdGx5IHNldHRpbmcgb3B0aW9ucy5ET1RFTlZfS0VZXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuRE9URU5WX0tFWSAmJiBvcHRpb25zLkRPVEVOVl9LRVkubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBvcHRpb25zLkRPVEVOVl9LRVlcbiAgfVxuXG4gIC8vIHNlY29uZGFyeSBpbmZyYSBhbHJlYWR5IGNvbnRhaW5zIGEgRE9URU5WX0tFWSBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICBpZiAocHJvY2Vzcy5lbnYuRE9URU5WX0tFWSAmJiBwcm9jZXNzLmVudi5ET1RFTlZfS0VZLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuRE9URU5WX0tFWVxuICB9XG5cbiAgLy8gZmFsbGJhY2sgdG8gZW1wdHkgc3RyaW5nXG4gIHJldHVybiAnJ1xufVxuXG5mdW5jdGlvbiBfaW5zdHJ1Y3Rpb25zIChyZXN1bHQsIGRvdGVudktleSkge1xuICAvLyBQYXJzZSBET1RFTlZfS0VZLiBGb3JtYXQgaXMgYSBVUklcbiAgbGV0IHVyaVxuICB0cnkge1xuICAgIHVyaSA9IG5ldyBVUkwoZG90ZW52S2V5KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvci5jb2RlID09PSAnRVJSX0lOVkFMSURfVVJMJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJTlZBTElEX0RPVEVOVl9LRVk6IFdyb25nIGZvcm1hdC4gTXVzdCBiZSBpbiB2YWxpZCB1cmkgZm9ybWF0IGxpa2UgZG90ZW52Oi8vOmtleV8xMjM0QGRvdGVudi5vcmcvdmF1bHQvLmVudi52YXVsdD9lbnZpcm9ubWVudD1kZXZlbG9wbWVudCcpXG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxuXG4gIC8vIEdldCBkZWNyeXB0IGtleVxuICBjb25zdCBrZXkgPSB1cmkucGFzc3dvcmRcbiAgaWYgKCFrZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0lOVkFMSURfRE9URU5WX0tFWTogTWlzc2luZyBrZXkgcGFydCcpXG4gIH1cblxuICAvLyBHZXQgZW52aXJvbm1lbnRcbiAgY29uc3QgZW52aXJvbm1lbnQgPSB1cmkuc2VhcmNoUGFyYW1zLmdldCgnZW52aXJvbm1lbnQnKVxuICBpZiAoIWVudmlyb25tZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJTlZBTElEX0RPVEVOVl9LRVk6IE1pc3NpbmcgZW52aXJvbm1lbnQgcGFydCcpXG4gIH1cblxuICAvLyBHZXQgY2lwaGVydGV4dCBwYXlsb2FkXG4gIGNvbnN0IGVudmlyb25tZW50S2V5ID0gYERPVEVOVl9WQVVMVF8ke2Vudmlyb25tZW50LnRvVXBwZXJDYXNlKCl9YFxuICBjb25zdCBjaXBoZXJ0ZXh0ID0gcmVzdWx0LnBhcnNlZFtlbnZpcm9ubWVudEtleV0gLy8gRE9URU5WX1ZBVUxUX1BST0RVQ1RJT05cbiAgaWYgKCFjaXBoZXJ0ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBOT1RfRk9VTkRfRE9URU5WX0VOVklST05NRU5UOiBDYW5ub3QgbG9jYXRlIGVudmlyb25tZW50ICR7ZW52aXJvbm1lbnRLZXl9IGluIHlvdXIgLmVudi52YXVsdCBmaWxlLmApXG4gIH1cblxuICByZXR1cm4geyBjaXBoZXJ0ZXh0LCBrZXkgfVxufVxuXG5mdW5jdGlvbiBfdmF1bHRQYXRoIChvcHRpb25zKSB7XG4gIGxldCBkb3RlbnZQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuZW52JylcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnBhdGggJiYgb3B0aW9ucy5wYXRoLmxlbmd0aCA+IDApIHtcbiAgICBkb3RlbnZQYXRoID0gb3B0aW9ucy5wYXRoXG4gIH1cblxuICAvLyBMb2NhdGUgLmVudi52YXVsdFxuICByZXR1cm4gZG90ZW52UGF0aC5lbmRzV2l0aCgnLnZhdWx0JykgPyBkb3RlbnZQYXRoIDogYCR7ZG90ZW52UGF0aH0udmF1bHRgXG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlSG9tZSAoZW52UGF0aCkge1xuICByZXR1cm4gZW52UGF0aFswXSA9PT0gJ34nID8gcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgZW52UGF0aC5zbGljZSgxKSkgOiBlbnZQYXRoXG59XG5cbmZ1bmN0aW9uIF9jb25maWdWYXVsdCAob3B0aW9ucykge1xuICBfbG9nKCdMb2FkaW5nIGVudiBmcm9tIGVuY3J5cHRlZCAuZW52LnZhdWx0JylcblxuICBjb25zdCBwYXJzZWQgPSBEb3RlbnZNb2R1bGUuX3BhcnNlVmF1bHQob3B0aW9ucylcblxuICBsZXQgcHJvY2Vzc0VudiA9IHByb2Nlc3MuZW52XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMucHJvY2Vzc0VudiAhPSBudWxsKSB7XG4gICAgcHJvY2Vzc0VudiA9IG9wdGlvbnMucHJvY2Vzc0VudlxuICB9XG5cbiAgRG90ZW52TW9kdWxlLnBvcHVsYXRlKHByb2Nlc3NFbnYsIHBhcnNlZCwgb3B0aW9ucylcblxuICByZXR1cm4geyBwYXJzZWQgfVxufVxuXG5mdW5jdGlvbiBjb25maWdEb3RlbnYgKG9wdGlvbnMpIHtcbiAgbGV0IGRvdGVudlBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy5lbnYnKVxuICBsZXQgZW5jb2RpbmcgPSAndXRmOCdcbiAgY29uc3QgZGVidWcgPSBCb29sZWFuKG9wdGlvbnMgJiYgb3B0aW9ucy5kZWJ1ZylcblxuICBpZiAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnBhdGggIT0gbnVsbCkge1xuICAgICAgZG90ZW52UGF0aCA9IF9yZXNvbHZlSG9tZShvcHRpb25zLnBhdGgpXG4gICAgfVxuICAgIGlmIChvcHRpb25zLmVuY29kaW5nICE9IG51bGwpIHtcbiAgICAgIGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZ1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gU3BlY2lmeWluZyBhbiBlbmNvZGluZyByZXR1cm5zIGEgc3RyaW5nIGluc3RlYWQgb2YgYSBidWZmZXJcbiAgICBjb25zdCBwYXJzZWQgPSBEb3RlbnZNb2R1bGUucGFyc2UoZnMucmVhZEZpbGVTeW5jKGRvdGVudlBhdGgsIHsgZW5jb2RpbmcgfSkpXG5cbiAgICBsZXQgcHJvY2Vzc0VudiA9IHByb2Nlc3MuZW52XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcm9jZXNzRW52ICE9IG51bGwpIHtcbiAgICAgIHByb2Nlc3NFbnYgPSBvcHRpb25zLnByb2Nlc3NFbnZcbiAgICB9XG5cbiAgICBEb3RlbnZNb2R1bGUucG9wdWxhdGUocHJvY2Vzc0VudiwgcGFyc2VkLCBvcHRpb25zKVxuXG4gICAgcmV0dXJuIHsgcGFyc2VkIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChkZWJ1Zykge1xuICAgICAgX2RlYnVnKGBGYWlsZWQgdG8gbG9hZCAke2RvdGVudlBhdGh9ICR7ZS5tZXNzYWdlfWApXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZXJyb3I6IGUgfVxuICB9XG59XG5cbi8vIFBvcHVsYXRlcyBwcm9jZXNzLmVudiBmcm9tIC5lbnYgZmlsZVxuZnVuY3Rpb24gY29uZmlnIChvcHRpb25zKSB7XG4gIGNvbnN0IHZhdWx0UGF0aCA9IF92YXVsdFBhdGgob3B0aW9ucylcblxuICAvLyBmYWxsYmFjayB0byBvcmlnaW5hbCBkb3RlbnYgaWYgRE9URU5WX0tFWSBpcyBub3Qgc2V0XG4gIGlmIChfZG90ZW52S2V5KG9wdGlvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBEb3RlbnZNb2R1bGUuY29uZmlnRG90ZW52KG9wdGlvbnMpXG4gIH1cblxuICAvLyBkb3RlbnZLZXkgZXhpc3RzIGJ1dCAuZW52LnZhdWx0IGZpbGUgZG9lcyBub3QgZXhpc3RcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHZhdWx0UGF0aCkpIHtcbiAgICBfd2FybihgWW91IHNldCBET1RFTlZfS0VZIGJ1dCB5b3UgYXJlIG1pc3NpbmcgYSAuZW52LnZhdWx0IGZpbGUgYXQgJHt2YXVsdFBhdGh9LiBEaWQgeW91IGZvcmdldCB0byBidWlsZCBpdD9gKVxuXG4gICAgcmV0dXJuIERvdGVudk1vZHVsZS5jb25maWdEb3RlbnYob3B0aW9ucylcbiAgfVxuXG4gIHJldHVybiBEb3RlbnZNb2R1bGUuX2NvbmZpZ1ZhdWx0KG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIGRlY3J5cHQgKGVuY3J5cHRlZCwga2V5U3RyKSB7XG4gIGNvbnN0IGtleSA9IEJ1ZmZlci5mcm9tKGtleVN0ci5zbGljZSgtNjQpLCAnaGV4JylcbiAgbGV0IGNpcGhlcnRleHQgPSBCdWZmZXIuZnJvbShlbmNyeXB0ZWQsICdiYXNlNjQnKVxuXG4gIGNvbnN0IG5vbmNlID0gY2lwaGVydGV4dC5zbGljZSgwLCAxMilcbiAgY29uc3QgYXV0aFRhZyA9IGNpcGhlcnRleHQuc2xpY2UoLTE2KVxuICBjaXBoZXJ0ZXh0ID0gY2lwaGVydGV4dC5zbGljZSgxMiwgLTE2KVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYWVzZ2NtID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtZ2NtJywga2V5LCBub25jZSlcbiAgICBhZXNnY20uc2V0QXV0aFRhZyhhdXRoVGFnKVxuICAgIHJldHVybiBgJHthZXNnY20udXBkYXRlKGNpcGhlcnRleHQpfSR7YWVzZ2NtLmZpbmFsKCl9YFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGlzUmFuZ2UgPSBlcnJvciBpbnN0YW5jZW9mIFJhbmdlRXJyb3JcbiAgICBjb25zdCBpbnZhbGlkS2V5TGVuZ3RoID0gZXJyb3IubWVzc2FnZSA9PT0gJ0ludmFsaWQga2V5IGxlbmd0aCdcbiAgICBjb25zdCBkZWNyeXB0aW9uRmFpbGVkID0gZXJyb3IubWVzc2FnZSA9PT0gJ1Vuc3VwcG9ydGVkIHN0YXRlIG9yIHVuYWJsZSB0byBhdXRoZW50aWNhdGUgZGF0YSdcblxuICAgIGlmIChpc1JhbmdlIHx8IGludmFsaWRLZXlMZW5ndGgpIHtcbiAgICAgIGNvbnN0IG1zZyA9ICdJTlZBTElEX0RPVEVOVl9LRVk6IEl0IG11c3QgYmUgNjQgY2hhcmFjdGVycyBsb25nIChvciBtb3JlKSdcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfSBlbHNlIGlmIChkZWNyeXB0aW9uRmFpbGVkKSB7XG4gICAgICBjb25zdCBtc2cgPSAnREVDUllQVElPTl9GQUlMRUQ6IFBsZWFzZSBjaGVjayB5b3VyIERPVEVOVl9LRVknXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogJywgZXJyb3IuY29kZSlcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnLCBlcnJvci5tZXNzYWdlKVxuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cbn1cblxuLy8gUG9wdWxhdGUgcHJvY2Vzcy5lbnYgd2l0aCBwYXJzZWQgdmFsdWVzXG5mdW5jdGlvbiBwb3B1bGF0ZSAocHJvY2Vzc0VudiwgcGFyc2VkLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZGVidWcgPSBCb29sZWFuKG9wdGlvbnMgJiYgb3B0aW9ucy5kZWJ1ZylcbiAgY29uc3Qgb3ZlcnJpZGUgPSBCb29sZWFuKG9wdGlvbnMgJiYgb3B0aW9ucy5vdmVycmlkZSlcblxuICBpZiAodHlwZW9mIHBhcnNlZCAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09CSkVDVF9SRVFVSVJFRDogUGxlYXNlIGNoZWNrIHRoZSBwcm9jZXNzRW52IGFyZ3VtZW50IGJlaW5nIHBhc3NlZCB0byBwb3B1bGF0ZScpXG4gIH1cblxuICAvLyBTZXQgcHJvY2Vzcy5lbnZcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocGFyc2VkKSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJvY2Vzc0Vudiwga2V5KSkge1xuICAgICAgaWYgKG92ZXJyaWRlID09PSB0cnVlKSB7XG4gICAgICAgIHByb2Nlc3NFbnZba2V5XSA9IHBhcnNlZFtrZXldXG4gICAgICB9XG5cbiAgICAgIGlmIChkZWJ1Zykge1xuICAgICAgICBpZiAob3ZlcnJpZGUgPT09IHRydWUpIHtcbiAgICAgICAgICBfZGVidWcoYFwiJHtrZXl9XCIgaXMgYWxyZWFkeSBkZWZpbmVkIGFuZCBXQVMgb3ZlcndyaXR0ZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9kZWJ1ZyhgXCIke2tleX1cIiBpcyBhbHJlYWR5IGRlZmluZWQgYW5kIHdhcyBOT1Qgb3ZlcndyaXR0ZW5gKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2Nlc3NFbnZba2V5XSA9IHBhcnNlZFtrZXldXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IERvdGVudk1vZHVsZSA9IHtcbiAgY29uZmlnRG90ZW52LFxuICBfY29uZmlnVmF1bHQsXG4gIF9wYXJzZVZhdWx0LFxuICBjb25maWcsXG4gIGRlY3J5cHQsXG4gIHBhcnNlLFxuICBwb3B1bGF0ZVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb25maWdEb3RlbnYgPSBEb3RlbnZNb2R1bGUuY29uZmlnRG90ZW52XG5tb2R1bGUuZXhwb3J0cy5fY29uZmlnVmF1bHQgPSBEb3RlbnZNb2R1bGUuX2NvbmZpZ1ZhdWx0XG5tb2R1bGUuZXhwb3J0cy5fcGFyc2VWYXVsdCA9IERvdGVudk1vZHVsZS5fcGFyc2VWYXVsdFxubW9kdWxlLmV4cG9ydHMuY29uZmlnID0gRG90ZW52TW9kdWxlLmNvbmZpZ1xubW9kdWxlLmV4cG9ydHMuZGVjcnlwdCA9IERvdGVudk1vZHVsZS5kZWNyeXB0XG5tb2R1bGUuZXhwb3J0cy5wYXJzZSA9IERvdGVudk1vZHVsZS5wYXJzZVxubW9kdWxlLmV4cG9ydHMucG9wdWxhdGUgPSBEb3RlbnZNb2R1bGUucG9wdWxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBEb3RlbnZNb2R1bGVcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/dotenv/lib/main.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/dotenv/package.json":
/*!******************************************!*\
  !*** ./node_modules/dotenv/package.json ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"dotenv","version":"16.3.1","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","lint-readme":"standard-markdown","pretest":"npm run lint && npm run dts-check","test":"tap tests/*.js --100 -Rspec","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"funding":"https://github.com/motdotla/dotenv?sponsor=1","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@definitelytyped/dtslint":"^0.0.133","@types/node":"^18.11.3","decache":"^4.6.1","sinon":"^14.0.1","standard":"^17.0.0","standard-markdown":"^7.1.0","standard-version":"^9.5.0","tap":"^16.3.0","tar":"^6.1.11","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}');

/***/ })

};
;