import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterOption {
  industry: {
    ind_id: number;
    industry_name: string;
  }[];
  merchant: {
    m_id: number;
    merchant_name: string;
  }[];
};


const initialState: FilterOption = {
  industry: [],
  merchant: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setIndustry: (state, action: PayloadAction<FilterOption["industry"]>) => {
      state.industry = action.payload;
    },
    setFilterOption: (state, action: PayloadAction<FilterOption>) => {
      state.industry = action.payload.industry;
      state.merchant = action.payload.merchant;
    },
    setMerchant: (state, action: PayloadAction<FilterOption["merchant"]>) => {
      state.merchant = action.payload;
    },
    clearFilterOption: (state) => {
      state.industry = [];
      state.merchant = [];
    }
  },
});

export const { actions } = filterSlice;
export const selectCurrentFilterOption = (state: any) => state.filter;
export const selectCurrentIndustry = (state: any) => state.filter.industry;
export const selectCurrentMerchant = (state: any) => state.filter.merchant;