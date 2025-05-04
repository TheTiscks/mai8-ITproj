import matplotlib.pyplot as plt
from io import BytesIO
import base64


def generate_occupancy_chart(data):
    plt.style.use('ggplot')
    fig, ax = plt.subplots(figsize=(12, 6))

    rooms = [room['name'] for room in data]
    rates = [room['occupancy_rate'] for room in data]

    bars = ax.barh(rooms, rates, color='#4F81BD')
    ax.set_xlabel('Процент занятости (%)', fontsize=12)
    ax.set_title('Занятость переговорных комнат', fontsize=14, pad=20)
    ax.set_xlim(0, 100)

    for bar in bars:
        width = bar.get_width()
        ax.text(width + 1, bar.get_y() + bar.get_height() / 2,
                f'{width:.1f}%',
                va='center', fontsize=10)

    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
    plt.close()
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode()