export function DiContainer() {
  this.registrations = {};
}

/**
 *
 * @param {string} name 인젝터블 명
 * @param {Array<string>} dependencies 의존성 명을 담은 배열
 * @param {Function} func 인젝터블 객체를 반환하는 함수
 */

DiContainer.prototype.messages = {
  registerRequireArgs: '이 생성자 함수는 인자가 3개 있어야 합니다. : "문자열, 문자열 배열, 함수"',
};

DiContainer.prototype.register = function (name, dependencies, func) {
  if (
    typeof name !== 'string' ||
    !Array.isArray(dependencies) ||
    dependencies.some((e) => typeof e !== 'string') ||
    typeof func !== 'function'
  ) {
    throw new Error(this.messages.registerRequireArgs);
  }

  this.registrations[name] = { dependencies, func };
};

DiContainer.prototype.get = function (name) {
  const registeration = this.registrations[name];

  if (registeration === undefined) return undefined;

  const dependencies = registeration.dependencies.map((dependencyName) => this.get(dependencyName).bind(this));

  return registeration.func.apply(undefined, dependencies);
};
