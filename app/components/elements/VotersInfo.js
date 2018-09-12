import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Popover } from 'antd';

import parseMoney from '../../utils/parse-money';
import currencySymbol from '../../utils/currency-symbol';

type Props = {
  content: {},
  children: React.Node
};

export default class VotersInfo extends Component<Props> {
  props: Props;

  render() {
    const { content, children } = this.props;

    const currency = 'usd';
    const currencyRate = 1;
    const curSymbol = currencySymbol(currency);

    const totalPayout =
      parseMoney(content.pending_payout_value) +
      parseMoney(content.total_payout_value) +
      parseMoney(content.curator_payout_value);

    const voteRshares = content.active_votes.reduce(
      (a, b) => a + parseFloat(b.rshares),
      0
    );
    const ratio = totalPayout / voteRshares;

    const votesData = content.active_votes
      .map(a => {
        const rew = a.rshares * ratio * currencyRate;

        return Object.assign(
          {},
          {
            reward: rew,
            reward_fixed: rew.toFixed(1)
          },
          a,
          { perc: (a.percent / 100).toFixed(1) }
        );
      })
      .sort((a, b) => {
        const keyA = a.reward;
        const keyB = b.reward;

        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      })
      .slice(0, 10);

    const popoverVisible = votesData.length > 0;
    const more = content.active_votes.length - 10;

    const popoverChildren = votesData.map(v => (
      <p key={v.voter}>
        <span className="voter">{v.voter}</span>
        <span className="percent">{v.perc}</span>
        <span className="reward">
          {' '}
          {v.reward_fixed}
          {curSymbol}
        </span>
      </p>
    ));

    if (more > 0) {
      popoverChildren.push(
        <p key="more" className="more">
          <FormattedMessage id="voters-info.n-more" values={{ n: more }} />
        </p>
      );
    }

    const popoverContent = (
      <div className="voters-info-popover-content">{popoverChildren}</div>
    );

    if (popoverVisible) {
      return (
        <Popover content={popoverContent} placement="bottom">
          {children}
        </Popover>
      );
    }

    return children;
  }
}