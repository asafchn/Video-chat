import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userStore from "./userStore";
import streamStore from "./streamStore";
import callStore from "./callStore";

const combinedReducers = combineReducers({ userStore, callStore, streamStore });

export const store = configureStore({ reducer: combinedReducers });

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatchType = typeof store.dispatch;
export const useAppDispatch: () => StoreDispatchType = useDispatch;
