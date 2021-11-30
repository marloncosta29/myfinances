import React, { useState, useEffect } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { InputForm } from "../../components/Forms/InputForm";
import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Forms/CategorySelect";
import { useForm, Controller } from "react-hook-form";
import { CategorySelect } from "../CategorySelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";
import { useAuth } from "../../contexts/AuthContext";

interface FormProps {
  name: string;
  preco: string;
}

const schema = yup.object({
  name: yup.string().required("Nome é obrigatorio"),
  preco: yup
    .number()
    .typeError("Informe um numero valido")
    .positive("O valor deve ser positivo")
    .required("Preço é obrigatorio"),
});

const categoryDefault = {
  key: "category",
  name: "Category",
};

export function Register() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState(categoryDefault);

  function handleSelectTransactionType(type: "up" | "down") {
    setTransactionType(type);
  }
  function handleCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpen(true);
  }
  const onSubmit = async ({ name, preco }: FormProps) => {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if (category.key === "category") {
      return Alert.alert("Selecione uma categoria");
    }

    const data = {
      id: String(uuid.v4()),
      name,
      preco,
      category: category.key,
      transactionType,
      date: new Date(),
    };
    try {
      const datakey = `@myfinances:transactions_user:${user.id}`;
      const transactions = await AsyncStorage.getItem(datakey).then((data) => {
        if (data) {
          return JSON.parse(data);
        }
        return [];
      });
      transactions.push(data);
      await AsyncStorage.setItem(datakey, JSON.stringify(transactions));
      setTransactionType("");
      setCategory(categoryDefault);
      reset();
      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel salvar");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              placeholder="Preço"
              name="preco"
              control={control}
              keyboardType="numeric"
              error={errors.preco && errors.preco.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                isActive={transactionType === "up"}
                onPress={() => handleSelectTransactionType("up")}
                type="up"
                title="Income"
              />
              <TransactionTypeButton
                isActive={transactionType === "down"}
                onPress={() => handleSelectTransactionType("down")}
                type="down"
                title="Outcome"
              />
            </TransactionsTypes>
            <CategorySelectButton
              onPress={handleOpenSelectCategory}
              title={category.name}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
        </Form>
        <Modal testID="modal-category" visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
