import React, { useState, useEffect, useCallback } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
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
import { categories } from "../../utils/categories";
import { useFocusEffect } from "@react-navigation/core";
import { useAuth } from "../../contexts/AuthContext";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

function formatToCurrencyBrl(amount: number) {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function getLastTransactionDate(transactions: any[], type: string) {
  if (transactions.length === 0) {
    return null;
  }

  const lastTransactioon = Math.max.apply(
    Math,
    transactions
      .filter((transaction) => transaction.transactionType === type)
      .map((transaction) => {
        return new Date(transaction.date).getTime();
      })
  );
  const day = new Date(lastTransactioon).getDate();
  const mounthLong = Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(lastTransactioon);

  return `${day} de ${mounthLong}`;
}

interface HighlightProps {
  amount: string;
  lastransaction: string;
}

interface HightlighData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const datakey = `@myfinances:transactions_user:${user.id}`;

  const [data, setData] = useState<DataListProps[]>([]);
  const [hightlighData, setHightlighData] = useState<HightlighData>({
    entries: { amount: "", lastransaction: "" },
    expensives: { amount: "", lastransaction: "" },
    total: { amount: "", lastransaction: "" },
  });
  async function loadTransactions() {
    let entriesSum = 0;
    let expenseveSum = 0;

    const transactions = await AsyncStorage.getItem(datakey).then((data) => {
      if (data) {
        return JSON.parse(data);
      }
      return [];
    });
    const transactionsFormatted: DataListProps[] = transactions.map(
      (transaction) => {
        const category = categories.find((c) => c.key === transaction.category);
        transaction.category = category;

        const preco = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(transaction.preco);

        if (transaction.transactionType === "up") {
          entriesSum = entriesSum + transaction.preco;
        } else {
          expenseveSum = expenseveSum + transaction.preco;
        }
        const date = moment(transaction.date).format("DD/MM/YY");
        return {
          id: transaction.id,
          type: transaction.transactionType === "up" ? "positive" : "negative",
          title: transaction.name,
          preco,
          category: category,
          date,
        };
      }
    );
    console.log(transactionsFormatted);

    setData(transactionsFormatted);

    const lastTrasactionEntrie = getLastTransactionDate(transactions, "up");
    const lastTrasactionExpensevee = getLastTransactionDate(
      transactions,
      "down"
    );

    setHightlighData({
      entries: {
        amount: formatToCurrencyBrl(entriesSum),
        lastransaction:
          (lastTrasactionEntrie &&
            `Ultima entrada em ${lastTrasactionEntrie}`) ||
          "Não há trasnsações",
      },
      expensives: {
        amount: formatToCurrencyBrl(expenseveSum),
        lastransaction:
          (lastTrasactionExpensevee &&
            `Ultima entrada em ${lastTrasactionExpensevee}`) ||
          "Não há trasnsações",
      },
      total: {
        amount: formatToCurrencyBrl(entriesSum - expenseveSum),
        lastransaction: `01 até ${lastTrasactionExpensevee}`,
      },
    });
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: user.photo,
              }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>{user.name}</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={signOut}>
            <PowerButton name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount={hightlighData.entries.amount}
          lastTransaction={hightlighData.entries.lastransaction}
          type="up"
        />
        <HighlightCard
          title="Saidas"
          amount={hightlighData.expensives.amount}
          lastTransaction={hightlighData.expensives.lastransaction}
          type="down"
        />
        <HighlightCard
          title="Total"
          amount={hightlighData.total.amount}
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
