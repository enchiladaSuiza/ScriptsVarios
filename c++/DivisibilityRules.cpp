#include <bits/stdc++.h>

using namespace std;

bool div_sobre_2(int n) {
    return n == 0 || n == 2 || n == 4 || n == 6 || n == 8;
}

bool div_sobre_3(int n) {
    return n == 0 || n == 3 || n == 6 || n == 9 || n == 12 || n == 15 || n == 18 || n == 21 || n == 24 || n == 27 || n == 30;
}

bool div_sobre_4(int n) {
    return n == 0 || n == 4 || n == 8 || n == 12 || n == 16 || n == 20 || n == 24 || n == 28 || n == 32 || n == 36 || n == 40;
}

bool div_sobre_5(int n) {
    return n == 0 || n == 5;
}

bool div_sobre_7(int n) {
    return n == 0 || n == 7 || n == 14 || n == 21 || n == 28 || n == 35 || n == 42 || n == 49 || n == 56 || n == 63 || n == 70;
}

bool div_sobre_8(int n) {
    return n == 0 || n == 8 || n == 16 || n == 24 || n == 32 || n == 40 || n == 48 || n == 56 || n == 64 || n == 72 || n == 80 || n == 88 || n == 96;
}

bool div_sobre_9(int n) {
    return n == 0 || n == 9 || n == 18 || n == 27 || n == 36 || n == 45 || n == 54 || n == 63 || n == 72 || n == 81 || n == 90;
}

bool regla_2(int n) {
    string s = to_string(n);
    int l = s.length();
    int ultimo_digito = s[l - 1] - '0';
    return div_sobre_2(ultimo_digito);
}

bool regla_3(int n) {
    string s;
    int l, suma = 0;
    do {
        if (div_sobre_3(n)) {
            return true;
        }
        s = to_string(n);
        l = s.length();
        if (l < 2) {
            break;
        }
        for (int i = 0; i < l; i++) {
            suma += s[i] - '0';
        }   
        n = suma;
        suma = 0;
    } while (true);
    return false;
}

bool regla_4(int n)
{
    string s;
    int l, ultimo_digito = 1, penultimo_digito = 1;
    do {
        if (div_sobre_4(n)) {
            return true;
        }
        s = to_string(n);
        l = s.length();
        if (l < 2) {
            break;
        }
        ultimo_digito = s[l - 1] - '0';
        penultimo_digito = s[l - 2] - '0';
        n = 2 * penultimo_digito + ultimo_digito;
    } while (true);
    return false;
}

bool regla_5(int n) {
    string s = to_string(n);
    int l = s.length();
    int ultimo_digito = s[l - 1] - '0';
    return div_sobre_5(ultimo_digito);
}

bool regla_7(int n) {
    string s;
    int l, ultimo_digito;
    do {
        if (div_sobre_7(n)) {
            return true;
        }
        s = to_string(n);
        l = s.length();
        if (l < 2) {
            break;
        }
        ultimo_digito = s[l - 1] - '0';
        n = stoi(s.substr(0, l - 1)) + 5 * ultimo_digito;
    } while (true);
    return false;
}

bool regla_8(int n) {
    string s;
    int l, ultimo_digito, penultimo_digito, antepenultimo_digito;
    do {
        if (div_sobre_8(n)) {
            return true;
        }
        s = to_string(n);
        l = s.length();
        if (l < 3) {
            break;
        }
        ultimo_digito = s[l - 1] - '0';
        penultimo_digito = s[l - 2] - '0';
        antepenultimo_digito = s[l - 3] - '0';
        n = 4 * antepenultimo_digito + 2 * penultimo_digito + ultimo_digito;
    } while (true);
    return false;
}

bool regla_9(int n) {
    string s;
    int l, suma = 0;
    do {
        if (div_sobre_9(n)) {
            return true;
        }
        s = to_string(n);
        l = s.length();
        if (l < 2) {
            break;
        }
        for (int i = 0; i < l; i++) {
            suma += s[i] - '0';
        }   
        n = suma;
        suma = 0;
    } while (true);
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    int i;
    cin >> i;

    cout << i << ": ";

    bool div_2 = regla_2(i);
    if (div_2) cout << "2 ";

    bool div_3 = regla_3(i);
    if (div_3) cout << "3 ";

    if (regla_4(i)) cout << "4 ";

    if (regla_5(i)) cout << "5 ";

    if (div_2 && div_3) cout << "6 ";

    if (regla_7(i)) cout << "7 ";

    if (regla_8(i)) cout << "8 ";

    if (regla_9(i)) cout << "9 ";

    cout << '\n';

    return 0;
}