import React, {Component} from 'react';

import whiteLogo from '../../image/white-logo.png';
import bgMainColored from '../../image/bg-main-colored.png';

import './Home.css';

export class Home extends Component {
  render() {
    // var start = new Date('<%=start_time.substr(0,10).replace(/\:/gi,'-') + start_time.slice(10)%>');
    // var end=new Date('<%=end_time.substr(0,10).replace(/\:/gi,'-') + end_time.slice(10)%>');
    // var total=end.getTime() - start.getTime();
    // setInterval(function(){
    //   var now = new Date();
    //   var diff = end.getTime() - now.getTime();
    //   var seconds = parseInt( Math.max(0,  Math.min(diff/1000.0 , total/1000.0)) );
    //   var hh =  parseInt( seconds / 3600 );
    //   var mm =  parseInt( (seconds%3600) / 60 );
    //   var ss =  parseInt( seconds % 60 );
    //   $('#remain_time').text( ((hh<10)?'0':'') + hh + ':' + ((mm<10)?'0':'') + mm + ':' + ((ss<10)?'0':'') +ss );
    // }, 1000);
    //

    /*
    <
                    % if(typeof user_id== 'undefined') {%>
                    <h1 className='lighter'>--개</h1>
                    <%} else {%>
                    <h1 className='lighter'><%=accepted%>개</h1>
                    <%}%>
     */

    return (
      <div className="Home">
        <section className="background-image contest-status" style={{backgroundImage: `url(${bgMainColored})`}}>
          <div className="container">
            <img src={whiteLogo} style={{height: 32}} alt="logo" />

            <p className="text-white">
              <span className="d-block mt-3"> 현재 대회 상황을 안내드립니다. </span>
              <span className="d-block"> 문의사항은 상단의 문의 메뉴를 통해 문의해 주세요. </span>
            </p>

            <div className="row text-white mt-5">
              <div className="col-md-3 col-6">
                <div className="heading-line color-white big"/>
                <h3 className="status-title"> 시작 시간 </h3>
                <h1 className="status-value font-weight-lighter">
                  {'14:00:00'}
                  {/* start_time.slice(11) */}
                </h1>
              </div>

              <div className="col-md-3 col-6">
                <div className="heading-line color-white big"/>
                <h3 className="status-title"> 종료 시간 </h3>
                <h1 className="status-value font-weight-lighter">
                  {'17:00:00'}
                  {/* end_time.slice(11) */}
                </h1>
              </div>

              <div className="col-md-3 col-6">
                <div className="heading-line color-white big"/>
                <h3 className="status-title"> 남은 시간 </h3>
                <h1 className="status-value font-weight-lighter">
                  {'01:30:00'}
                </h1>
                {/* <h1 className="lighter" id="remain_time"/> */}
              </div>

              <div className="col-md-3 col-6">
                <div className="heading-line color-white big"/>
                <h3 className="status-title "><strong>푼 문제</strong></h3>
                <h1 className="status-value font-weight-lighter">
                  {'3'}
                </h1>
              </div>

            </div>
          </div>
        </section>

        <div className="rules">
          <div className="container">

            <h1 className="font-weight-lighter mb-5">대회 규정</h1>

            <p className="lead mb-5">
              <strong>shake!</strong>는 4개 대학교에 재학중인 학부생에 한해 참가할 수 있습니다.
              <br/> 휴학생 및 전국 대학생 프로그래밍 경시대회 입상자는 참가할 수 없습니다.
              <br/>
            </p>

            <h3 className="font-weight-lighter my-4">대회 진행 규칙</h3>
            <ul className="mb-5">
              <li>
                <strong>shake!</strong>는 1인 1팀, 즉 개인전의 형태로 치뤄진다.
              </li>
              <li>
                대회에 사용할 노트북은 각자 개인 지참해야 하며, 1인당 1대의 노트북만 허용한다.
              </li>
              <li>
                개인 노트북을 제외한 모든 전자기기의 사용은 금지한다. 단, 마우스 및 키보드에 한해 감독관의 허가하에 사용 가능하다.
              </li>
              <li>
                개인적인 책이나 인쇄물 등 하드카피 된 자료들의 반입 및 열람이 가능하나, 이와 관련된 모든 책임은 참가자에게 있다.
              </li>
              <li>
                대회가 진행되는 동안에 참가자간에 의사소통, 자료들의 공유는 금지된다.
              </li>
              <li>
                메신저 사용, 검색, 기존 소스코드 복사 등 모든 소프트 카피 된 자료들의 사용 및 열람은 부정행위로 간주한다.
              </li>
              <li>
                대회장에서는 주어진 무선 네트워크만을 사용하며, 다른 네트워크를 사용할 시 부정행위로 간주한다.
              </li>
              <li>
                모든 부정행위자는 실격처리 되며, 그 결과를 각 학교에 통보한다.
              </li>
            </ul>

            <h3 className="font-weight-lighter my-4">대회 진행 방식</h3>
            <ul className="mb-5">
              <li>참가자는 각 문제에 대한 해답을 소스코드 형식으로 제출 해야하며, 사용 가능한 프로그래밍 언어는 Java, C, C++로 제한한다.</li>
              <li>제출된 소스코드는 컴퓨터가 자동으로 채점하여 정답 여부를 결정한다.</li>
              <li>모든 정답 코드는 컴퓨터와 채점관들을 통하여 여러 번에 걸쳐 유사도 검사를 진행하게 되며, 이를 통하여 부정행위 여부를 검사한다.</li>
              <li>대회 진행 페이지의 문의하기 기능을 통하여 채점관에게 문제에 관한 질문을 할 수 있다.</li>
              <li>문제와 관련되지 않은 사항은 대회장에 있는 감독관에게 직접 문의한다.</li>
              <li>대회 진행 도중 심각한 문제점이 발견 된 경우 해당 문제를 재채점 할 수 있으며, 이는 모든 참가자에게 공지한다.</li>
            </ul>

            <h3 className="font-weight-lighter my-4">답안 채점 방식</h3>
            <ul className="mb-5">
              <li>모든 답안은 컴퓨터를 통하여 자동 채점 되며, 모든 정답 답안은 채점관과 컴퓨터를 통하여 유사도 검사를 거쳐 부정행위 여부를 판별한다.</li>
              <li>컴파일 과정이나 실행 도중에 에러가 발생하는 경우 해당 답안은 오답처리한다.</li>
              <li>답안 코드에 고의적으로 시스템에 피해를 줄 수 있게 작성되었다고 판단 될 경우 부정행위로 판단한다.</li>
              <li>참가자가 제출한 답안이 정답인 경우, 대회 시작 후 경과 시간과 오답 제출 횟수에 따라 패널티를 적용한 결과를 반영한다.</li>
              <li>모든 참가자는 자신이 제출한 답안에 대한 채점 결과를 실시간으로 확인할 수 있다.</li>
              <li>모든 답안은 같은 환경에서 채점 되며, 사전에 채점 환경을 숙지하지 않은 책임은 모두 참가자에게 있다.</li>
              <li>제출한 프로그램에 대한 입출력은 표준 입출력 만을 인정하며, 파일을 생성하거나 읽을 시 오답으로 간주한다.</li>
            </ul>

            <h3 className="font-weight-lighter my-4">순위 결정 방식</h3>
            <ul className="mb-5">
              <li>모든 참가자는 실시간 순위를 직접 확인할 수 있다.</li>
              <li>모든 부정행위자는 순위에서 제외한다.</li>
              <li>집단적인 부정행위가 발견될 경우, 해당 학교에 패널티가 가해질 수 있다.</li>
              <li>모든 참가자는 소속, 학년, 나이, 성별 등 대회 외적인 사항으로 결과에 이익이나 불이익을 받지 않는다.</li>
              <li>제출한 답이 정답인 경우, 제출자에게는 <strong>(대회 시작 후 경과 시간) + (해당 문제 오답 제출 수 x 20분)</strong>의 패널티를 가산한다.</li>
              <li>단, 오답의 경우 해당 문제를 맞출 때 까지는 참가자에게 패널티를 부여하지 않는다.</li>
              <li>1차적으로, 정답 문제 수가 많은 참가자가 높은 순위를 부여 받는다.</li>
              <li>2차적으로, 정답 문제 수가 같은 참가자는 패널티가 적을 수록 높은 순위를 부여 받는다.</li>
              <li>3차적으로, 마지막으로 정답으로 인정된 답안의 제출 시간이 빠를 수록 높은 순위를 부여받는다.</li>
              <li>대회가 종료된 후 문제와 답안에 대한 사후 검수를 마친 후 최종 결과를 공지하며, 변동사항은 반드시 참가자들에게 공지한다.</li>
            </ul>

            <div className="row">
              <div className="col-sm-5">
                <h4>채점 환경</h4>
                <p>
                  <strong>OS</strong> Ubuntu 14.04.2 LTS
                  <br/>
                </p>

                <strong>컴파일러</strong>
                <ul>
                  <li><strong>C/C++</strong> gcc/g++ 4.8.4 (MS C/C++ 사용시 유의할 것)</li>
                  <li><strong>Java</strong> java 1.8.0 (Main.java로 작성할 것)</li>
                </ul>
                <strong>입력 및 출력</strong>
                <ul>
                  <li><strong>C/C++</strong> stdin, stdout</li>
                  <li><strong>Java</strong> System.in, System.out</li>
                </ul>

              </div>
              <div className="col-sm-7">
                <h4>채점 결과</h4>
                <p>
                  <strong>대기중</strong> 현재 다른 답안들을 채점하는 중인 경우
                  <br/>
                  <strong>컴파일중</strong> 채점을 위해 답안을 컴파일하는 중인 경우
                  <br/>
                  <strong>채점중</strong> 컴퓨터가 답안을 채점하는 중인 경우
                  <br/>
                  <strong>정답</strong> 제출한 답안이 정답으로 인정된 경우
                  <br/>
                  <strong>오답</strong> 제출한 답안이 틀린 데이터를 출력한 경우
                  <br/>
                  <strong>시간 초과</strong> 제한 시간 내에 출제자의 프로그램이 종료되지 않은 경우
                  <br/>
                  <strong>메모리 초과</strong> 제출한 프로그램이 허용된 메모리보다 많은 메모리를 사용한 경우
                  <br/>
                  <strong>컴파일 에러</strong> 제출한 코드에 문제가 있어서 컴파일이 되지 않는 경우. 단, 경고(Warning)은 에러로 간주하지 않는다.
                  <br/>
                  <strong>런타임 에러</strong> 제출한 프로그램이 컴파일은 되었으나, 실행 도중에 문제를 일으킨 경우.
                  <br/>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default Home;
