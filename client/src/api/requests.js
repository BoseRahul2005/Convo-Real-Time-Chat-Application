import API from './axios'
//inputs for LLM
export const findUsers = async (que) => {
    return await API.post("/user/find-user", { que });
};
