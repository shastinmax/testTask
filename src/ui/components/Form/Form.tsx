import React, { ChangeEvent, useEffect, useState } from 'react';

import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../common/Button/Button';
import { ModalError } from '../../../common/ModalError/ModalError';
import { PathNavigation } from '../../../enums/Navigation';
import { useAppSelector } from '../../../hooks/useAppSelectorHook';
import { addUser } from '../../../store/middlewares/form/addUser';
import { getPositions } from '../../../store/middlewares/form/getPositions';
import { getToken } from '../../../store/middlewares/form/getToken';
import { selectInitialized } from '../../../store/selectors/appSelector/appSelector';
import { selectErrorValue } from '../../../store/selectors/errorSelector/errorSelector';
import { selectPosition } from '../../../store/selectors/formSelector/formSelector';
import { selectIsRedirect } from '../../../store/selectors/userSelector/userSelector';
import { useTypedDispatch } from '../../../store/store';
import { checkValidation } from '../../../utils/checkValidation/checkValidation';
import { InputFile } from '../InputFile/InputFile';
import { Position } from '../Position/Position';

import s from './Form.module.scss';

import preloader from 'assets/image/Preloader/Preloader.svg';

const FIRST_ELEMENT_INDEX = 0;

export const Form = () => {
  const dispatch = useTypedDispatch();

  const initialized = useAppSelector(selectInitialized);
  const errorMessage = useAppSelector(selectErrorValue);
  const positions = useAppSelector(selectPosition);
  const isRedirectValue = useAppSelector(selectIsRedirect);

  const navigate = useNavigate();

  const [isDisable, setIsDisable] = useState<boolean>(true);

  const formik: any = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      position_id: 1,
      photo: '',
    },
    validate: values => checkValidation(formik, values, setIsDisable),
    onSubmit: (data, { resetForm }) => {
      dispatch(addUser({ ...data, position_id: Number(data.position_id) }));
      setIsDisable(false);
      resetForm();
    },
  });

  const hasError = (value: string) => formik.touched[value] && formik.errors[value];

  const setFormError = (value: string) =>
    formik.touched[value] && formik.errors[value] ? (
      <div className={s.form__error}>{formik.errors[value]}</div>
    ) : null;

  const onPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
  };

  const onPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length) {
      formik.setFieldValue('photo', e.currentTarget.files[FIRST_ELEMENT_INDEX]);
    }
  };

  useEffect(() => {
    dispatch(getPositions());
    dispatch(getToken());
  }, []);

  if (isRedirectValue) {
    navigate(`${PathNavigation.USERS}`);
  }

  return (
    <div className={`container ${s.form__box}`}>
      {errorMessage && <ModalError />}

      <h2 className="title">Working with POST request</h2>
      <form className={s.form__wrapper} onSubmit={formik.handleSubmit}>
        <div>
          <label className={s.form__labelStyle_error}>
            <input
              className={`${s.form__input} ${hasError('name') && s.form__input_error} `}
              placeholder="Your name"
              {...formik.getFieldProps('name')}
            />
            {setFormError('name')}
          </label>

          <label className={s.form__labelStyle_error}>
            <input
              className={`${s.form__input} ${hasError('email') && s.form__input_error} `}
              placeholder="Email"
              {...formik.getFieldProps('email')}
            />
            {setFormError('email')}
          </label>

          <label className={`${s.form__label} ${s.form__labelStyle_error}`}>
            <input
              className={`${s.form__input} ${hasError('phone') && s.form__input_error} `}
              type="text"
              placeholder="Phone"
              {...formik.getFieldProps('phone')}
            />
            <span className={s.form__label_span}>+38 (XXX) XXX - XX - XX</span>
            {setFormError('phone')}
          </label>
        </div>

        <div className={s.form__select_wrap}>
          {initialized && <img className={s.preloader} src={preloader} alt="preloader" />}
          <p className={s.form__select_text}>Select your position</p>
          <Position
            positions={positions}
            onPositionChange={onPositionChange}
            setFormError={setFormError}
            positionId={formik.values.position_id}
          />
        </div>
        <InputFile
          onPhotoChange={onPhotoChange}
          setFormError={setFormError}
          hasError={hasError}
        />
        <Button type="submit" text="Sing up" isDisable={isDisable} />
      </form>
    </div>
  );
};
