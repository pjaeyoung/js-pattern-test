# 3장 객체를 바르게 만들기
## 3.1 원시형
- 문자열(string), 숫자(number), 불(bool), undefined, null , Symbol
- 한 번 이상 참조할 상수는 변수에 담아서 참조하기 
- 범위 체크 기능이 필요하다면 객체로 변환하여 메소드로 만들기 

## 3.2 객체 리터럴
- 중괄호({})로 생성하는 방식
    - 매번 중괄호로 작성 => 검증 불가능, 의존성 주입 불가능, 함수 인자가 많아 순서를 정확히 맞추기 힘들 때 유용 
    - 함수 반환값으로 틀을 만들고 단 한 번 작성 => DRY한 방식 , 검증 가능, 의존성 주입 가능 

## 3.3 모듈 패턴
- 1. 임의 모듈 생성
- 2. 즉시 실행 모듈 생성 
- 모듈 생성시 유념할 점
    - 단일 책임 원칙에 따라 한 모듈에 한 가지 일만 시키기
    - 모듈 자신이 쓸 객체가 있다면 의존성 주입 형태로(직접 혹은 팩토리 주입 형태) 객체 제공
    - 다른 객체 로직을 확장하는 모듈은 해당 로직의 의도가 바뀌지 않도록 분명히 밝히기 

## 3.4 객체 프로토타입과 프로토타입 상속
- 객체 리터럴은 저절로 내장 객체 `Object.prototype`에 연결 ex) toString 메서드 사용 가능
- `Object.create` 메서드를 사용하면 기존 객체와 프로토타입이 연결된 객체를 새로 만들 수 있음
- 프로토타입 체인(prototype chain) : 다층 프로토타입을 이용하여 여러 계층의 상속 구현  

## 3.5 new 객체 생성 
- 생성자 함수 : 주어진 인자를 내부적으로 생성할 인스턴스의 프로퍼티에 할당 
- 초기화 코드를 공유할 때 유용
- `instanceof`로 new 키워드로 함수를 호출했는지 여부를 판단하여 아닌 경우 에러를 반환하여 방어함 
## 3.6 멍키 패치 
- 추가 프로퍼티를 객체에 붙이는 것 
- 요건이 만족되면 필요한 기능을 갖춘 객체로부터 메서드를 복사하여 가지는 방법 