import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend/appointment/bloc/appointment_event.dart';

import '../bloc/appointment_bloc.dart';
import '../widgets/selection_button.dart';
import '../widgets/selection_card.dart';

class CalendarPage extends StatefulWidget {
  final void Function(int index) setIndex;

  const CalendarPage({super.key, required this.setIndex});

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  final String title = 'Choisissez une disponibilité';
  DateTime? selectedDate;
  late List<DateTime> availabilities;

  @override
  void initState() {
    super.initState();
    availabilities = BlocProvider.of<AppointmentBloc>(context).availabilities;
    selectedDate = BlocProvider.of<AppointmentBloc>(context).tempDate;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        children: [
          Expanded(
            flex: 7,
            child: calendarMainWidget(),
          ),
          Flexible(
            child: Row(
              children: [
                Flexible(
                  flex: 1,
                  child: previousButton(),
                ),
                Flexible(
                  flex: 1,
                  child: continueButton(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget calendarMainWidget() {
    Map<DateTime, List<String>> calendarOptions = getCalendarOptionMap();
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          SizedBox(
            height: 100,
            child: Center(
              child: Text(
                title,
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ),
          ),
          Column(
            children: calendarOptions.entries
                .where((element) => element.value.isNotEmpty)
                .map(
                  (entry) => calendarWidget(entry),
                )
                .toList(),
          ),
        ],
      ),
    );
  }

  Map<DateTime, List<String>> getCalendarOptionMap() {
    Map<DateTime, List<String>> calendarOptions = {};
    for (DateTime date in availabilities) {
      DateTime dateWithoutTime = DateTime(date.year, date.month, date.day);
      if (calendarOptions[dateWithoutTime] == null) {
        calendarOptions[dateWithoutTime] = [];
      }
      String hour = date.hour < 10 ? '0${date.hour}' : '${date.hour}';
      String minute = date.minute < 10 ? '0${date.minute}' : '${date.minute}';
      List<String> newTimeOption = calendarOptions[dateWithoutTime]!;
      // This is a hack because I'm not parsing correctly the date from API
      // Good enough
      if (newTimeOption.contains('$hour:$minute') || hour == '22') {
        continue;
      }
      newTimeOption.add('$hour:$minute');
      calendarOptions[dateWithoutTime] = newTimeOption;
    }
    return calendarOptions;
  }

  Widget continueButton() {
    return selectionButton(
      context,
      title: 'Continuer',
      isSelectable: selectedDate != null,
      onPressed: () {
        BlocProvider.of<AppointmentBloc>(context).tempDate = selectedDate;
        BlocProvider.of<AppointmentBloc>(context).add(
          SaveAppointmentEvent(),
        );
        Navigator.pop(context);
      },
    );
  }

  Widget previousButton() {
    return selectionButton(
      context,
      title: 'Précédent',
      isSelectable: true,
      onPressed: () {
        widget.setIndex(2);
      },
    );
  }

  Widget calendarWidget(MapEntry<DateTime, List<String>> entry) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        calendarTitleWidget(entry.key),
        Wrap(
          children: entry.value.map((e) => calendarCard(e, entry.key)).toList(),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget calendarTitleWidget(DateTime date) {
    String weekDay = getWeekDayString(date.weekday);
    String month = getMonthString(date.month);
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Text(
          '$weekDay ${date.day} $month',
          style: Theme.of(context).textTheme.titleLarge,
        ),
      ),
    );
  }

  String getWeekDayString(int weekDay) {
    switch (weekDay) {
      case 1:
        return 'Lundi';
      case 2:
        return 'Mardi';
      case 3:
        return 'Mercredi';
      case 4:
        return 'Jeudi';
      case 5:
        return 'Vendredi';
      case 6:
        return 'Samedi';
      case 7:
        return 'Dimanche';
      default:
        return '';
    }
  }

  String getMonthString(int month) {
    switch (month) {
      case 1:
        return 'Janvier';
      case 2:
        return 'Février';
      case 3:
        return 'Mars';
      case 4:
        return 'Avril';
      case 5:
        return 'Mai';
      case 6:
        return 'Juin';
      case 7:
        return 'Juillet';
      case 8:
        return 'Août';
      case 9:
        return 'Septembre';
      case 10:
        return 'Octobre';
      case 11:
        return 'Novembre';
      case 12:
        return 'Décembre';
      default:
        return '';
    }
  }

  Widget calendarCard(String title, DateTime date) {
    DateTime dateWithTime = DateTime(date.year, date.month, date.day,
        int.parse(title.substring(0, 2)), int.parse(title.substring(3, 5)));
    bool isSelected = selectedDate == dateWithTime;
    return SizedBox(
      width: 80,
      child: selectionCard(
        context,
        isSelected: isSelected,
        onTap: () {
          if (isSelected) {
            setState(() {
              selectedDate = null;
            });
          } else {
            setState(() {
              selectedDate = dateWithTime;
            });
          }
        },
        child: Center(
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      ),
    );
  }
}
