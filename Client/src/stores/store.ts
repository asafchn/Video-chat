import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userStore from "./userStore";
import callStore from "./callStore";

const combinedReducers = combineReducers({ userStore, callStore });

export const store = configureStore({ reducer: combinedReducers });

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatchType = typeof store.dispatch;
export const useAppDispatch: () => StoreDispatchType = useDispatch;
