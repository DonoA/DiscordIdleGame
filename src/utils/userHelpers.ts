import { AppDispatch } from '../store';
import { addUser } from '../actions';
import { generateUser } from './nameHelpers';

export const createNewUser = async (
  serverName: string,
  dispatch: AppDispatch,
  existingUserNames: string[]
) => {
  const { name } = await generateUser(existingUserNames);
  dispatch(addUser(serverName, name) as any);
};