# Schleim VPN in de Android-app

De browser-Extension bevat een **Schleim VPN-tegel**. In Schleim Browser voor Android opent deze via het URI-schema `schleimbrowser://vpn` het native VPN-menu.

De Extension kan zelf geen systeembrede VPN-tunnel maken. De Android-app bestuurt OpenVPN for Android als externe client; die client beheert Androids `VpnService`, toestemming en de tunnel.

- Browsermenu: **Schleim VPN**
- Extension: Startscherm → **Schleim VPN** → **VPN-bediening openen**
- Profielen en serverlocaties komen uit het repository-manifest.
- De externe OpenVPN-client en actuele geldige OpenVPN-profielen zijn vereist.

Zie de installatie en profielbeperkingen in de [Android-browserdocumentatie](../../docs/Niederländisch/ANDROID-BROWSER.md#schleim-vpn--proton-free).
