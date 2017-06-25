import React, {Component} from 'react';
import moment from 'moment';

import RuleDesc from './RuleDesc';
import StatusHeading from './StatusHeading';

import whiteLogo from '../../image/white-logo.png';
import bgMainColored from '../../image/bg-main-colored.png';

import contestRule from '../../data/contest_rule.json';
import contestStyle from '../../data/contest_style.json';
import answerJudge from '../../data/answer_judge.json';
import rankJudge from '../../data/rank_judge.json';

import judgeResult from '../../data/judge_result.json';
import judgeEnv from '../../data/judge_env.json';

import './Home.css';

import 'moment-duration-format';

export class Home extends Component {
  render() {
    const descList = [contestRule, contestStyle, answerJudge, rankJudge];

    return (
      <div className="Home">
        {/*<section className="background-image contest-status" style={{backgroundImage: `url(${bgMainColored})`}}>
          <div className="container-wrapper">
            <div className="container text-white">
              <img src={whiteLogo} style={{height: 32}} alt="logo" />

              <div className="mt-4">
                <div> 현재 대회 상황을 안내드립니다. </div>
                <div> 문의사항은 상단의 문의 메뉴를 통해 문의해 주세요. </div>
              </div>

              <div className="mt-4">
                <h3> {moment(start).format(dateFormat)} </h3>
              </div>

              <div className="row mt-4">
                {
                  statusList.map((status, index) => (
                    <StatusHeading status={status} key={index} />
                  ))
                }
              </div>
            </div>
          </div>
        </section>*/}
        <div className="page">
          <div className="container">
            <div className="page-title">
              <h1 className="font-weight-light mb-5">대회 규정</h1>

              <p className="mb-0"> <strong>shake!</strong>는 4개 대학교에 재학중인 학부생에 한해 참가할 수 있습니다. </p>
              <p> 휴학생 및 전국 대학생 프로그래밍 경시대회 입상자는 참가할 수 없습니다. </p>
            </div>

            {descList.map((desc, index) => (
              <RuleDesc detail={desc} key={index} />
            ))}

            <div className="row">
              <div className="col-sm-5 page py-0">
                <div className="page-sub-title">
                  <h3 className="font-weight-light"> 채점 환경 </h3>
                </div>
                {
                  judgeEnv.map((env, index) => (
                    <div key={index}>
                      <strong> {env.title} </strong>

                      <ul>
                        {env.items.map((item, itemIdx) => (
                          <li key={itemIdx}><strong> {item.title} </strong> {item.desc} </li>
                        ))}
                      </ul>
                    </div>
                  ))
                }
              </div>

              <div className="col-sm-7 page py-0">
                <div className="page-sub-title">
                  <h3 className="font-weight-light">채점 결과</h3>
                </div>
                {
                  judgeResult.map((result, index) => (
                    <p key={index} className="mb-0">
                      <strong> {result.name} </strong> {result.desc}
                    </p>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
