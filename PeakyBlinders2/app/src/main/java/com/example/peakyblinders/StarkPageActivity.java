package com.example.peakyblinders;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;

public class StarkPageActivity extends AppCompatActivity {

    RecyclerView recyclerView;

    String names[];
    int images[] = {R.drawable.eddard, R.drawable.catelyn, R.drawable.robb,
            R.drawable.john_snow, R.drawable.sansa, R.drawable.arya, R.drawable.bran};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_stark_page);

        recyclerView = findViewById(R.id.recyclerView);

        names = getResources().getStringArray(R.array.starks_family);

        MyAdapter myAdapter = new MyAdapter(this, names, images);
        recyclerView.setAdapter(myAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

    }
}