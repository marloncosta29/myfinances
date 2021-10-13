import React from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  PowerButton,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: "1",
      title: "Desenvolvimento de site",
      amount: "R$ 999999,99",
      category: { name: "Vendas", icon: "dollar-sign" },
      date: "01/01/2021",
      type: "positive",
    },
    {
      id: "2",
      title: "Mercado",
      amount: "R$ 400,99",
      category: { name: "Comptas", icon: "coffee" },
      date: "01/01/2021",
      type: "negative",
    },
    {
      id: "3",
      title: "Salario",
      amount: "R$ 1000,99",
      category: { name: "Ganhos", icon: "shopping-bag" },
      date: "01/01/2021",
      type: "positive",
    },
  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://www.seekpng.com/png/detail/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png",
              }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Marlon da costa</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <PowerButton name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Ultima transação em 13 de julho"
          type="up"
        />
        <HighlightCard
          title="Saidas"
          amount="R$ 1.000,00"
          lastTransaction="Ultima transação em 15 de agosto"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="16.400,00"
          lastTransaction="1 até 18 abril"
          type="total"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          renderItem={({ item }) => <TransactionCard data={item} />}
          keyExtractor={(item) => item.id}
        />
      </Transactions>
    </Container>
  );
}
