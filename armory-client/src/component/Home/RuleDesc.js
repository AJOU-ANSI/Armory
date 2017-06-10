import React from 'react';

export const RuleDesc = ({detail}) => (
  <div>
    <h3 className="font-weight-light my-4"> {detail.title} </h3>
    <ul className="mb-5">
      {
        detail.items.map((item, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
        ))
      }
    </ul>
  </div>
);

export default RuleDesc;
