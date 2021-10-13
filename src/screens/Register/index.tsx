import React, { useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { InputForm } from "../../components/Forms/InputForm";
import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Forms/CategorySelect";
import { useForm, Controller } from "react-hook-form";
import { CategorySelect } from "../CategorySelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";

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

export function Register() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log({ errors: errors });

  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Category",
  });

  function handleSelectTransactionType(type: "up" | "down") {
    setTransactionType(type);
  }
  function handleCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpen(true);
  }
  const onSubmit = ({ name, preco }: FormProps) => {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if (category.key === "category") {
      return Alert.alert("Selecione uma categoria");
    }

    const data = {
      name,
      preco,
      category: category.key,
      transactionType,
    };
    console.log({ data });
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
        <Modal visible={categoryModalOpen}>
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
