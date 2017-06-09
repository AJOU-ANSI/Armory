import React, {Component} from 'react';

import './Footer.css';

export class Footer extends Component {
  render() {
    return (
      <div className="Footer py-5 ">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h6 className="uppercase-text letter-spacing">About</h6>
              <p>shake!는 경희대학교, 성균관대학교, 아주대학교, 한양대학교 ERICA 4개 대학교가 서로 교류를 통해 발전하고, 경쟁을 통해 새로운 인재를 발견하는 데에 목적을 두고
                있습니다.</p>
            </div>
            <div className="col-2 offset-2">
              <h6 className="uppercase-text letter-spacing">Credits</h6>
              <p><strong>Powered by</strong>
                <br/><a href="http://linc.ajou.ac.kr">LINC사업단
                  <small>아주대학교</small>
                </a>
                <br/>
                <br/><strong>Directed by </strong>
                <br/>A.N.S.I
                <small> 아주대학교</small>
              </p>
            </div>
            <div className="col-2">
              <h6 className="uppercase-text hidden-sm hidden-xs letter-spacing" style={{opacity:0}}>'</h6>
              <p><strong>Sponsered by</strong>
                <br/><a href="http://d2.naver.com">D2
                  <small>Naver</small>
                </a>
                <br/>
                <br/>
                <strong>Develop/Design</strong>
                <a href="https://fb.com/CodingMonster">
                  <br/>코딩몬스터
                </a>
              </p>

            </div>
            <div className="col-xs-12 text-center">
              <div className="space"/>
              <div className="divider"/>
              <p className="letter-spacing small-text"><strong>© shake! 2017.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Footer;
