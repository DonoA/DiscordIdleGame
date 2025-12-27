import { AppDispatch } from '../store';
import { addUser } from '../actions';
import { getData } from './dataCache';
import { getUniqueName } from './nameHelpers';

export const createNewUser = async (
  serverName: string,
  dispatch: AppDispatch,
  existingUserNames: string[]
) => {
  const { users: userNames } = await getData();
  const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
  const allowedName = getUniqueName(randomUser, existingUserNames);
  dispatch(addUser(serverName, allowedName) as any);
};