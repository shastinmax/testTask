import { Dispatch } from 'redux';

import { tokenApi } from '../../../api/token';
import { setToken } from '../../actionCreators/form/actionCreator';

export const getToken = () => async (dispatch: Dispatch) => {
  try {
    const response = await tokenApi.getToken();

    dispatch(setToken(response.data.token));
  } catch (e) {
    // eslint-disable-next-line no-alert
    console.log(e);
  }
};
