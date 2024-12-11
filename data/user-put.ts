import mutation from './_mutation';
import useSWRMutation from 'swr/mutation'
import { API_URL } from '@/constants/Api'

export default function useUserPut (id: any) {
  const { trigger, data, error, isMutating } = useSWRMutation(`${API_URL}/users/${id}`, (url, { arg }: { arg: any }) => {
    console.log("arg: ", arg);
    return mutation(url, {
      method: 'PATCH',
      body: arg,
    });
  });

  console.log("data: ", data);
  console.log("error: ", error);
  console.log("isMutating: ", isMutating);
 
  return {
    data,
    isMutating,
    isError: error,
    trigger
  }
}