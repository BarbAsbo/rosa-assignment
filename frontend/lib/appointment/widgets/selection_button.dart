import 'package:flutter/material.dart';

Widget selectionButton(
  BuildContext context, {
  required String title,
  required bool isSelectable,
  required void Function() onPressed,
}) {
  return Container(
    decoration: const BoxDecoration(
      border: Border(
        top: BorderSide(
          color: Colors.grey,
          width: 1,
        ),
      ),
    ),
    padding: const EdgeInsets.all(20),
    child: SizedBox(
      height: 55,
      child: TextButton(
        onPressed: onPressed,
        child: Container(
          color:
              isSelectable ? Theme.of(context).primaryColor : Colors.grey[300],
          width: double.infinity,
          child: Center(
            child: Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
