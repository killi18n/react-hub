import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { repoActions } from 'store/modules/repo';
import Title from 'components/common/Title';
import RepoListWrapper from 'components/repo/RepoListWrapper';
import RepoList from 'components/repo/RepoList';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Pager from 'components/common/Pager';

class MyPageContainer extends Component {
  componentDidMount() {
    const {
      pagingInfo: {
        currentPage,
        perPage: { visible },
      },
    } = this.props;
    this.getRepoList({ page: currentPage, perPage: visible });
  }

  getRepoList = async ({ page, perPage }) => {
    const { RepoActions } = this.props;
    try {
      await RepoActions.repoList({
        accessToken: localStorage.getItem('accessToken'),
        page,
        perPage,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleClickPerPage = ({ clicked }) => {
    const { RepoActions } = this.props;
    RepoActions.clickPerPage({ clicked });
  };

  selectPerPage = ({ perPage }) => {
    const { RepoActions } = this.props;
    RepoActions.selectPerPage({ perPage });
  };

  setPage = ({ page }) => {
    const { RepoActions } = this.props;
    RepoActions.setPage({ page });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pagingInfo.currentPage !== this.props.pagingInfo.currentPage) {
      this.getRepoList({ page: this.props.pagingInfo.currentPage, perPage: this.props.pagingInfo.perPage.visible });
    }

    if (prevProps.pagingInfo.perPage.visible !== this.props.pagingInfo.perPage.visible) {
      this.getRepoList({ page: 1, perPage: this.props.pagingInfo.perPage.visible });
      this.setPage({ page: 1 });
    }
  }

  render() {
    const { repoList, pagingInfo } = this.props;
    const { handleClickPerPage, selectPerPage, setPage } = this;
    if (repoList.length === 0) return <LoadingSpinner />;
    return (
      <RepoListWrapper>
        <Title title="My repo list" />
        <RepoList list={repoList} />
        <Pager pagingInfo={pagingInfo} onClickPerPage={handleClickPerPage} onSelect={selectPerPage} setPage={setPage} />
      </RepoListWrapper>
    );
  }
}

export default connect(
  ({ repo }) => ({
    repoList: repo.list,
    pagingInfo: repo.pagingInfo,
  }),
  dispatch => ({
    RepoActions: bindActionCreators(repoActions, dispatch),
  })
)(MyPageContainer);
