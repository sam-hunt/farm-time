import { useContext } from 'react';
import { HoursContext, IHoursContext } from '../App/App';

export type IUseHours = IHoursContext;
const useHours = () => useContext(HoursContext);

export default useHours;
